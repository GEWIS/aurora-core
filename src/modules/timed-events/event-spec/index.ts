import TimedEventReset from './timed-event-reset';
import TimedEventPing from './timed-event-ping';
import TimedEventCleanAuditLogs from './timed-event-clean-audit-logs';
import {
  TimedEventSwitchHandlerAudio,
  TimedEventSwitchHandlerLights,
  TimedEventSwitchHandlerScreen,
} from './timed-event-switch-handler';

type EventSpec =
  | TimedEventReset
  | TimedEventPing
  | TimedEventCleanAuditLogs
  | TimedEventSwitchHandlerAudio
  | TimedEventSwitchHandlerLights
  | TimedEventSwitchHandlerScreen;

export default EventSpec;
