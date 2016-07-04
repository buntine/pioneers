namespace Helpers {
    export function imageSource(category: string, file: string): string {
        return `/static/images/${category}/${file}`;
    }

    export function onHighRes(resolution: Structure.Resolution, f: (ts: number) => void): void {
        if (resolution == "High") {
            requestAnimationFrame(f);
        } else {
            f(performance.now());
        }
    }

    export function openPopup(content: string): void {
        $.magnificPopup.open({
            items: {
                src: content,
                type: "inline"
            },
            removalDelay: 300,
            mainClass: "mfp-fade"
        });
    }

    export function centerize(container_width: number, width: number, offset: number): number {
        return (offset * container_width) + ((container_width / 2) - (width / 2));
    }

    export function parseDescription(): (text: string, render: (s: string) => string) => string {
        return (text: string, render: (s: string) => string) => {
            let rendered = render(text);

            return rendered.replace(/\#\{(.+?|.+?)\}/g, (_: string, t: string) => {
                let [title, tag] = t.split("|");

                return `<a href="#" class="add_tag" data-tag="${tag}">${title}</a>`;
            });
        };
    }
}
