    class Pioneer {
        public details: Structure.Person;

        public flagPath(): string {
            return Helpers.imageSource("flags", `${this.details.country.toLowerCase()}.png`);
        }

        public show(): void {
            $.get('/static/templates/person.mst', (template: string) => {
                let rendered = Mustache.render(template, {
                person: this.details, 
                years: () => { `${this.details.yob} - ${this.details.yod || ""}` },
                flag: this.flagPath()});

                $.magnificPopup.open({
                    items: {
                        src: `<div class="pioneer_overlay white-popup">${rendered}</div>`,
                        type: "inline"
                    },
                    removalDelay: 300,
                    mainClass: "mfp-fade"
                });
            });
        }
    }

