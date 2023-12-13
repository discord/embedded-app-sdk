export interface MessageData {
  nonce?: string;
  event?: string;
  command?: string;
  data?: Record<string, unknown>;
  args?: Record<string, unknown>;
}
