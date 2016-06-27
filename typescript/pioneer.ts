class Pioneer {
    public details: Structure.Person;

    public flagPath(): string {
        return Helpers.imageSource("flags", `${this.details.country.toLowerCase()}.png`);
    }

    public show(): void {
        $.get('/static/templates/person.mst', (template: string) => {
            let rendered = Mustache.render(template, {
            person: this.details, 
            years: () => { return `${this.details.yob} - ${this.details.yod || ""}` },
            parseDescription: () => {
              return (text: string, render: (s: string) => string) => {
                let rendered = render(text);

                return rendered.replace(/\#\{(.+?)\}/g, (_: string, t: string) => {
                  let [title, tag] = t.split("|");

                  if (!tag) { tag = title; }

                  return `<a href="#" data-tag="${tag}">${title}</a>`;
                });
              }
            },
            flag: this.flagPath()});

            $.magnificPopup.open({
                items: {
                    src: `<div class="pioneer_overlay">${rendered}</div>`,
                    type: "inline"
                },
                removalDelay: 300,
                mainClass: "mfp-fade"
            });
        });
    }
}
