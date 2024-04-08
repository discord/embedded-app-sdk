export const consoleLevels = ['log', 'warn', 'debug', 'info', 'error'] as const;
export type ConsoleLevel = (typeof consoleLevels)[number];

export function wrapConsoleMethod(
  console: any,
  level: ConsoleLevel,
  callback: (level: ConsoleLevel, msg: string) => void,
) {
  const _consoleMethod = console[level];
  const _console = console;

  if (!_consoleMethod) {
    return;
  }

  console[level] = function () {
    const args = [].slice.call(arguments);
    const message = '' + args.join(' ');
    callback(level, message);
    _consoleMethod.apply(_console, args);
  };
}
