const FailedTaskNameSuffix = " (failed)";

interface PromiseLike<TValue> {
    then<TNewValue>(p: (value: TValue) => TNewValue): PromiseLike<TNewValue>,
    catch(p: (error: any) => TValue | void): PromiseLike<TValue | void>
}

export function startStopwatch(name: string): Stopwatch {
    const sw = new Stopwatch(name);
    sw.start();
    return sw;
}

export function run<T>(name: string, task: () => T): T {
    const sw = startStopwatch(name);
    try {
        const result = task();
        sw.stop();
        return result;
    } catch (e) {
        sw.stop(FailedTaskNameSuffix);
        throw e;
    }
}

export function runAsync<TValue, TPromise extends PromiseLike<TValue>>(name: string, task: () => TPromise): TPromise {
    const sw = startStopwatch(name);

    const result = task();

    result
        .then(() => sw.stop())
        .catch(() => sw.stop(FailedTaskNameSuffix));

    return result;
}

export class Stopwatch {
    readonly name: string;
    private startTime: number;
    private lastLapStartTime: number;

    constructor(name: string) {
        this.name = name;
    }

    start() {
        this.startTime = Date.now();
        this.lastLapStartTime = this.startTime;
    }

    stop(remarks?: string, log = true): number {
        const durationMs = Date.now() - this.startTime;
        if (this.lastLapStartTime > this.startTime) {
            this.lap(log);
        }
        if (log) {
            let msg = `${this.name}: ${durationMs / 1000} s`;
            if (remarks) {
                msg += ` (${remarks})`;
            }
            console.log(msg);
        }
        return durationMs;
    }

    lap(log = true): number {
        const now = Date.now();
        const durationMs = now - this.lastLapStartTime;
        if (log) {
            console.log(`${this.name} lap: ${durationMs / 1000} s`);
        }
        this.lastLapStartTime = now;
        return durationMs;
    }
}
