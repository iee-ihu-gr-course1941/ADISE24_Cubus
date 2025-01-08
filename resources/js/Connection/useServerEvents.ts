/**
 * This is the core abstraction layer for websocket communication.
 */

import { useEffect, useRef, useState } from "react";
import { ConnectionState, ChannelsMap } from "@/types/connection";

type WSEventCallback<C extends keyof ChannelsMap = any, E extends keyof ChannelsMap[C] = any> = (event: ChannelsMap[C][E]) => void;
type MapChannelEvent<C extends keyof ChannelsMap = any, E extends keyof ChannelsMap[C] = any> = {[key in C]: {name: E, callback: WSEventCallback}[]};

const WS_CONNECTION_UPDATE_INTERVAL = 1000;

export default function useServerEvents() {
    const stateRef = useRef<number>(-1);
    const [connectionState, setConnectionState] = useState<ConnectionState>(ConnectionState.Disconnected);
    const [eventCallbacks, setEventCallbacks] = useState<MapChannelEvent>({});

    useEffect(() => {
        console.info('Prepping ws listeners for: ', eventCallbacks);
        for(let [channel, events] of Object.entries(eventCallbacks)) {
            let registeredChannel = null;
            if(!channel.startsWith('.')) {
                 registeredChannel = window.Echo.channel(channel);
            } else {
                 registeredChannel = window.Echo.private(channel.slice(1));
            }

            for(const event of events) {
                registeredChannel.listen(event.name, event.callback);
            }
        }

        stateRef.current = window.setInterval(() => {
            setConnectionState(window.Echo.connector.pusher.connection.state);
        }, WS_CONNECTION_UPDATE_INTERVAL);

        return () => {
            for(let [channel, events] of Object.entries(eventCallbacks)) {
                let registeredChannel;
                if(!channel.startsWith('.')) {
                    registeredChannel = window.Echo.channel(channel);
                } else {
                    registeredChannel = window.Echo.private(channel.slice(1));
                }

                for(const event of events) {
                    registeredChannel.stopListening(event.name, event.callback);
                }
            }
            clearInterval(stateRef.current);
        }
    }, [eventCallbacks]);

    function listen<C extends keyof ChannelsMap, E extends keyof ChannelsMap[C]>(channel: C, name: E, callback: WSEventCallback<C, E>) {
        setEventCallbacks((oldEventCallbacks) => {
            let newEventCallbacks = {...oldEventCallbacks};

            if(!oldEventCallbacks[channel]) {
                newEventCallbacks[channel] = [{name, callback}];
                return newEventCallbacks;
            }

            newEventCallbacks[channel] = [...oldEventCallbacks[channel], {name, callback}];
            return newEventCallbacks;
        });
    }

    function stopListening<C extends keyof ChannelsMap, E extends keyof ChannelsMap[C]>(channel: C, name: E, callback?: WSEventCallback<C, E>) {
        setEventCallbacks((oldEventCallbacks) => {
            let newEventCallbacks = {...oldEventCallbacks};

            const channelEvents = oldEventCallbacks[channel] ?? [];
            if(channelEvents.length === 0) return newEventCallbacks;

            const removedIndex = channelEvents.findIndex((curr: any) =>
                curr.name === name && (curr.callback == null || curr.callback === callback)
            );

            if(removedIndex !== channelEvents.length - 1) {
                channelEvents[removedIndex] = channelEvents[channelEvents.length - 1];
            }
            channelEvents.pop();
            newEventCallbacks[channel] = channelEvents;

            return newEventCallbacks;
        });
    }

    return {
        connectionState,
        listen,
        stopListening
    }
}
