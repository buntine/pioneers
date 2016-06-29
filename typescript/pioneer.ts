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

            Helpers.openPopup(`<div class="pioneer_overlay">${rendered}</div>`);

            // Add click event for this particular pioneers "show all" link.
            $(".pioneer_overlay a.all_achievements").click((e: Event) => {
                e.preventDefault();
                this.allAchievements();
            });
        });
    }

    public allAchievements(): void {
        $.get(`/people/${this.details.id}/achievements`, (resp: {achievements: Array<Structure.Achievement>}) => {
            $.get('/static/templates/achievements.mst', (template: string) => {
                let rendered = Mustache.render(template, {
                    achievements: resp.achievements, 
                    parseDescription: this.parseDescription,
                });

                $(".pioneer_overlay ul.person_achievements").html(rendered);
                $(".pioneer_overlay a.all_achievements").hide();
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
