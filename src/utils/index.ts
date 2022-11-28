function pad0 ( n: number ) : string | number {
    return n >= 10? n: `0${n}`;
}

export function s2min (t: number) : string {
    let min = Math.floor(t / 60);
    let sec = Math.round(Math.floor(t % 60));

    return `${ pad0(min) }:${ pad0(sec) }`;
}

export function fullscreen (target: any | null | HTMLVideoElement) {
    if ( !target ) target = document.documentElement;
    const doc = document as any;
    let $current = doc.fullscreenElement || doc.webkitFullscreenElement;
    if ($current) {
        (doc.exitFullscreen || doc.webkitExitFullscreen).call(doc);
    } else {
        (target.requestFullscreen || target.webkitRequestFullScreen).call(target);
    }
}