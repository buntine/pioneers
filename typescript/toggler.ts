type Possibility = [string, string];

interface TogglerOptions {
    selector: string;
    ops: Array<Possibility>;
    callback: (p: Possibility) => void;
}

class Toggler {
    private element: any; // Zepto.
    private ops: Array<Possibility>;
    private callback: (p: Possibility) => void;

    constructor(options: TogglerOptions) {
        this.element = $(options.selector);
        this.ops = options.ops;
        this.callback = options.callback;
    }

    public draw(): Toggler {
        this.ops.forEach((p: Possibility, i: number) => {
            let link = $(`<a href="#" data-val="${p[1]}" title="${p[0]}">${p[0]}</a>`);

            if (i == 0) {
                link.addClass("selected");
            }

            link.click((e: Event) => {
                e.preventDefault();

                let selected = $(e.target);
                this.setTo(selected.data("val"), true);
            });

            this.element.append(link);
        });

        return this;
    }

    public get(): Possibility {
        let e = this.element.find("a.selected").first();

        if (e) {
            return [e.text(), e.data("val")];
        }
    }

    public getSelectedVal(): string {
        let v = this.get();

        if (v) {
            return v[1];
        }
    }

    public setTo(v: string, triggerCallback = false): boolean {
        let e = this.element.find(`a[data-val='${v}']`);

        if (!e) {
            return false;
        } else {
            if (!e.hasClass("selected")) {
                this.element.find("a").removeClass("selected");
                e.addClass("selected");

                if (triggerCallback) { this.callback(this.get()); }
            }

            return true;
        }
    }
}
