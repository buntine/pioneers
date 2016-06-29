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
                remainingAchievements: () => { return this.details.total_achievements - this.details.achievements.length },
                parseDescription: this.parseDescription,
                flag: this.flagPath(),
            });

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

    public allAchievements(): void {
        $.get(`/people/${this.details.id}/achievements`, (achievements: Array<Structure.Achievement>) => {
            $.get('/static/templates/achievement.mst', (template: string) => {
                let rendered = Mustache.render(template, {
                    achievements: achievements, 
                    parseDescription: this.parseDescription,
                });

                console.log(rendered);
            });
        }, "json");
    }

    private parseDescription(): (text: string, render: (s: string) => string) => string {
        return (text: string, render: (s: string) => string) => {
            let rendered = render(text);

            return rendered.replace(/\#\{(.+?|.+?)\}/g, (_: string, t: string) => {
                let [title, tag] = t.split("|");

                return `<a href="#" class="add_tag" data-tag="${tag}">${title}</a>`;
            });
        }
    }
}
