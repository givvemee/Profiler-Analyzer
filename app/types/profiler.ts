export interface ProfilerData {
  dataForRoots: DataForRoot[];
  duration: number;
  flamechart: FlamechartData[];
  internalModuleSourceToRanges: any;
  laneToLabelMap: LaneToLabelMap;
  laneToReactMeasureMap: LaneToReactMeasureMap;
  otherUserTimingMarks: any[];
  reactVersion: string;
  schedulingEvents: SchedulingEvent[];
  snapshots: Snapshot[];
  startTime: number;
  suspenseEvents: any[];
  thrownErrors: any[];
  nativeEvents: NativeEvent[];
  networkMeasures: any[];
  componentMeasures: ComponentMeasure[];
}

export interface DataForRoot {
  commitData: CommitData[];
  displayName: string;
  initialTreeBaseDurations: Map<number, number>;
  operations: number[][];
  rootID: number;
  snapshots: Map<number, SnapshotNode>;
}

export interface CommitData {
  changeDescriptions: Map<number, ChangeDescription> | null;
  duration: number;
  effectDuration: number | null;
  fiberActualDurations: Map<number, number>;
  fiberSelfDurations: Map<number, number>;
  passiveEffectDuration: number | null;
  priorityLevel: string | null;
  timestamp: number;
  updaters: Updater[] | null;
}

export interface ChangeDescription {
  context: any;
  didHooksChange: boolean;
  isFirstMount: boolean;
  props: string[];
  state: any;
  hooks: any;
}

export interface Updater {
  displayName: string;
  hocDisplayNames: string[] | null;
  id: number;
  key: string | null;
  type: string;
}

export interface FlamechartData {
  [key: string]: any;
}

export interface LaneToLabelMap {
  [key: string]: string;
}

export interface LaneToReactMeasureMap {
  [key: string]: ReactMeasure[];
}

export interface ReactMeasure {
  batchUID: number;
  depth: number;
  duration: number;
  lanes: string[];
  timestamp: number;
  type: string;
}

export interface SchedulingEvent {
  lanes: string[];
  timestamp: number;
  type: string;
  warning: string | null;
}

export interface Snapshot {
  height: number;
  id: string;
  image: string | null;
  imageSource: string;
  timestamp: number;
  width: number;
}

export interface NativeEvent {
  depth: number;
  duration: number;
  timestamp: number;
  type: string;
  warning: string | null;
}

export interface ComponentMeasure {
  componentName: string;
  duration: number;
  timestamp: number;
  type: string;
  warning: string | null;
}

export interface SnapshotNode {
  children: number[];
  displayName: string | null;
  hocDisplayNames: string[] | null;
  id: number;
  key: string | null;
  type: string;
}

export interface PerformanceMetrics {
  averageRenderTime: number;
  maxRenderTime: number;
  minRenderTime: number;
  totalRenders: number;
  componentsCount: number;
  slowestComponents: ComponentPerformance[];
}

export interface ComponentPerformance {
  name: string;
  renderTime: number;
  renderCount: number;
  status: 'good' | 'warning' | 'critical';
}

export type PerformanceStatus = 'good' | 'warning' | 'critical';

export interface ThresholdConfig {
  good: number;
  warning: number;
  critical: number;
}