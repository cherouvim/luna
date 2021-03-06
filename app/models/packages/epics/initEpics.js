/* eslint-disable import/prefer-default-export */

import { ipcRenderer } from 'electron';
import { ofType } from 'redux-observable';
import { mergeMap, concatMap, tap } from 'rxjs/operators';

import { clearSelected, toggleLoader } from 'models/ui/actions';
import { clearInstallOptions } from 'models/common/actions';
import { clearNotifications } from 'models/notifications/actions';
import { clearCommands, clearAuditData } from 'models/npm/actions';

import { onOffOperator } from '../operators';
import { clearPackages, setPackagesStart } from '../actions';

const ON = 'ON';
const OFF = 'OFF';

const updateLoader = payload => ({
  type: toggleLoader.type,
  payload
});

const initEpic = (action$, state$) =>
  action$.pipe(
    ofType(setPackagesStart.type),
    mergeMap(({ payload: { channel, options } }) => {
      const {
        ui: { paused },
        common: { mode, directory }
      } = state$.value;

      return [
        paused ? OFF : ON,
        {
          payload: {
            channel,
            options: {
              ...options,
              mode,
              directory
            }
          }
        }
      ];
    }),
    onOffOperator(ON, OFF),
    tap(({ payload: { channel, options } }) =>
      ipcRenderer.send(channel, options)
    ),
    concatMap(() => [
      updateLoader({
        loading: true,
        message: 'Loading packages...'
      }),
      clearAuditData(),
      clearSelected(),
      clearCommands(),
      clearNotifications(),
      clearInstallOptions(),
      clearPackages()
    ])
  );

export { initEpic };
