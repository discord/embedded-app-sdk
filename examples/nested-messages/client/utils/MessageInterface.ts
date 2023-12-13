import EventEmitter from 'eventemitter3';
import {v4 as uuidv4} from 'uuid';

import type {MessageData} from './types';

export class MessageInterface {
  isReady: boolean = false;
  private pendingMessages: Map<
    string,
    {
      resolve: (response: unknown) => unknown;
      reject: (error: unknown) => unknown;
    }
  > = new Map();
  private eventBus = new EventEmitter();

  constructor() {
    window.addEventListener('message', this.handleMessage);

    this.eventBus.once('READY', () => {
      this.isReady = true;
    });

    this.sendMessage({command: 'NOTIFY_CHILD_IFRAME_IS_READY'});
  }

  ready = async () => {
    if (this.isReady) {
      return;
    } else {
      await new Promise<void>((resolve) => {
        this.eventBus.once('READY', resolve);
      });
    }
  };

  subscribe = async (event: string, listener: (...args: any[]) => unknown, subscribeArgs?: Record<string, unknown>) => {
    const listenerCount = this.eventBus.listenerCount(event);
    const emitter = this.eventBus.on(event, listener);

    if (listenerCount === 0) {
      await this.sendMessage({
        command: 'SUBSCRIBE',
        args: subscribeArgs,
        event,
      });
    }

    return emitter;
  };

  unsubscribe = async (event: string, listener: (...args: any[]) => unknown) => {
    if (this.eventBus.listenerCount(event) === 1) {
      await this.sendMessage({
        command: 'UNSUBSCRIBE',
        event,
      });
    }
    return this.eventBus.off(event, listener);
  };

  handleMessage = (ev: MessageEvent<MessageData>) => {
    const {data: messageData} = ev;
    // Bail out if messageData is not an "{}" object
    if (typeof messageData !== 'object' || Array.isArray(messageData) || messageData === null) {
      return;
    }
    const {nonce, event, command, data} = messageData;

    if (command === 'DISPATCH') {
      if (event == null) {
        throw new Error('DISPATCH has no event defined');
      }
      this.eventBus.emit(event, data);
      return;
    }

    if (!nonce) {
      console.warn('Message received without a nonce', ev);
      return;
    }

    this.pendingMessages.get(nonce)?.resolve(messageData);
    this.pendingMessages.delete(nonce);
  };

  sendMessage = ({command, event, data, args}: Record<string, any>) => {
    const nonce = uuidv4();
    window.parent.postMessage(
      {
        command,
        event,
        data,
        args,
        nonce,
      },
      !!document.referrer ? document.referrer : '*'
    );

    const promise = new Promise((resolve, reject) => {
      this.pendingMessages.set(nonce, {resolve, reject});
    });

    return promise;
  };
}
