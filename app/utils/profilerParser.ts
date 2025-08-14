import {
  ProfilerData,
  PerformanceMetrics,
  ComponentPerformance,
  CommitData,
  DataForRoot,
} from '@/app/types/profiler';
import { getPerformanceStatus, RENDER_TIME_THRESHOLDS } from './thresholds';

export function parseProfilerData(jsonData: any): ProfilerData {
  return jsonData as ProfilerData;
}

export function calculatePerformanceMetrics(data: ProfilerData): PerformanceMetrics {
  const allRenderTimes: number[] = [];
  const componentRenderMap = new Map<string, { totalTime: number; count: number }>();

  data.dataForRoots.forEach((root: DataForRoot) => {
    root.commitData.forEach((commit: CommitData) => {
      allRenderTimes.push(commit.duration);

      // Handle both Map and Object types for fiberActualDurations
      if (commit.fiberActualDurations) {
        const durations = commit.fiberActualDurations instanceof Map 
          ? commit.fiberActualDurations 
          : new Map(Object.entries(commit.fiberActualDurations).map(([k, v]) => [Number(k), v]));

        durations.forEach((duration, fiberId) => {
          // Handle both Map and Object types for snapshots
          let snapshot;
          if (root.snapshots) {
            if (root.snapshots instanceof Map) {
              snapshot = root.snapshots.get(fiberId);
            } else if (Array.isArray(root.snapshots)) {
              snapshot = root.snapshots.find((s: any) => s.id === fiberId);
            } else {
              snapshot = root.snapshots[fiberId];
            }
          }
          
          if (snapshot) {
            const componentName = snapshot.displayName || `Component_${fiberId}`;
            const existing = componentRenderMap.get(componentName) || { totalTime: 0, count: 0 };
            componentRenderMap.set(componentName, {
              totalTime: existing.totalTime + duration,
              count: existing.count + 1,
            });
          }
        });
      }
    });
  });

  const slowestComponents: ComponentPerformance[] = Array.from(componentRenderMap.entries())
    .map(([name, data]) => ({
      name,
      renderTime: data.totalTime / data.count,
      renderCount: data.count,
      status: getPerformanceStatus(data.totalTime / data.count, RENDER_TIME_THRESHOLDS),
    }))
    .sort((a, b) => b.renderTime - a.renderTime)
    .slice(0, 10);

  return {
    averageRenderTime: allRenderTimes.length > 0
      ? allRenderTimes.reduce((a, b) => a + b, 0) / allRenderTimes.length
      : 0,
    maxRenderTime: allRenderTimes.length > 0 ? Math.max(...allRenderTimes) : 0,
    minRenderTime: allRenderTimes.length > 0 ? Math.min(...allRenderTimes) : 0,
    totalRenders: allRenderTimes.length,
    componentsCount: componentRenderMap.size,
    slowestComponents,
  };
}

export function getCommitDataForChart(data: ProfilerData) {
  const chartData: any[] = [];
  
  data.dataForRoots.forEach((root) => {
    root.commitData.forEach((commit, index) => {
      // Handle both Map and Object types for fiberActualDurations
      const componentsCount = commit.fiberActualDurations instanceof Map
        ? commit.fiberActualDurations.size
        : Object.keys(commit.fiberActualDurations || {}).length;

      chartData.push({
        commitIndex: index + 1,
        renderDuration: commit.duration,
        effectDuration: commit.effectDuration || 0,
        passiveEffectDuration: commit.passiveEffectDuration || 0,
        timestamp: commit.timestamp,
        componentsCount: componentsCount,
      });
    });
  });

  return chartData;
}

export function getComponentTreeData(data: ProfilerData) {
  const treeData: any[] = [];

  data.dataForRoots.forEach((root) => {
    const rootNode = {
      name: root.displayName,
      value: 0,
      children: [] as any[],
    };

    if (root.commitData.length > 0) {
      const lastCommit = root.commitData[root.commitData.length - 1];
      
      // Handle both Map and Object types for durations
      const actualDurations = lastCommit.fiberActualDurations instanceof Map 
        ? lastCommit.fiberActualDurations 
        : new Map(Object.entries(lastCommit.fiberActualDurations || {}).map(([k, v]) => [Number(k), v]));
      
      const selfDurations = lastCommit.fiberSelfDurations instanceof Map 
        ? lastCommit.fiberSelfDurations 
        : new Map(Object.entries(lastCommit.fiberSelfDurations || {}).map(([k, v]) => [Number(k), v]));

      // Handle different snapshot formats
      if (root.snapshots) {
        if (root.snapshots instanceof Map) {
          root.snapshots.forEach((snapshot, id) => {
            const duration = actualDurations.get(id) || 0;
            const selfDuration = selfDurations.get(id) || 0;
            
            rootNode.children.push({
              name: snapshot.displayName || `Component_${id}`,
              actualDuration: duration,
              selfDuration: selfDuration,
              status: getPerformanceStatus(duration, RENDER_TIME_THRESHOLDS),
            });
          });
        } else if (Array.isArray(root.snapshots)) {
          root.snapshots.forEach((snapshot: any) => {
            const id = snapshot.id;
            const duration = actualDurations.get(id) || 0;
            const selfDuration = selfDurations.get(id) || 0;
            
            rootNode.children.push({
              name: snapshot.displayName || `Component_${id}`,
              actualDuration: duration,
              selfDuration: selfDuration,
              status: getPerformanceStatus(duration, RENDER_TIME_THRESHOLDS),
            });
          });
        } else {
          Object.entries(root.snapshots).forEach(([id, snapshot]: [string, any]) => {
            const numId = Number(id);
            const duration = actualDurations.get(numId) || 0;
            const selfDuration = selfDurations.get(numId) || 0;
            
            rootNode.children.push({
              name: snapshot.displayName || `Component_${id}`,
              actualDuration: duration,
              selfDuration: selfDuration,
              status: getPerformanceStatus(duration, RENDER_TIME_THRESHOLDS),
            });
          });
        }
      }

      rootNode.value = rootNode.children.reduce((sum, child) => sum + child.actualDuration, 0);
    }

    treeData.push(rootNode);
  });

  return treeData;
}

export function getRenderPhasesData(data: ProfilerData) {
  const phasesData: any[] = [];

  data.dataForRoots.forEach((root) => {
    root.commitData.forEach((commit, index) => {
      const totalDuration = commit.duration + (commit.effectDuration || 0) + (commit.passiveEffectDuration || 0);
      
      phasesData.push({
        commit: `Commit ${index + 1}`,
        render: commit.duration,
        effect: commit.effectDuration || 0,
        passiveEffect: commit.passiveEffectDuration || 0,
        total: totalDuration,
      });
    });
  });

  return phasesData;
}