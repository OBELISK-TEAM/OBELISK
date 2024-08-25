export interface ZoomContext {
  zoomValue: number;
  showZoomBadge: boolean;
  handleZoom: (newZoom: number) => void;
}
