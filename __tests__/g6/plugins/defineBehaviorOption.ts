/* eslint-disable @typescript-eslint/ban-types */
import { IBehaviorOption, Graph } from '@antv/g6';

/**
 * 一个简单的类型推导函数，传入defaultCfg推导出一个behavior的基础类型。
 * 这可能是个临时函数，更好的做法是推进G6官方，为behavior提供更多的类型推导支持
 */
export function defineBehaviorBase<
    Cfg extends Record<string, any>,
    BehaviorInstance = IBehaviorOption & Cfg & {
        graph: Graph;
        set<T = any>(name: string, value: T): void;
        get<T = any>(name: string): T;
        [key: string]: unknown;
    }
>(defaultCfg: Cfg): BehaviorInstance {
    return {
        getDefaultCfg() {
            return {
                ...defaultCfg,
            };
        },
    } as any;
}