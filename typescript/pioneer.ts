class Pioneer {
    public details: Structure.Person;

    public flagPath(): string {
        return Helpers.imageSource("flags", `${this.details.country.toLowerCase().replace(/\W/g, "_")}.png`);
    }

    public show(): void {
        $.get('/static/templates/person.mst', (template: string) => {
            let rendered = Mustache.render(template, {
                person: this.details, 
                years: () => { return `${this.details.yob} - ${this.details.yod || ""}` },
                remainingAchievements: () => { return this.details.total_achievements - this.details.achievements.length },
                parseDescription: Helpers.parseDescription,
                rating: this.rating,
                flag: this.flagPath(),
            });

            $("div#pioneer_overlay").html(rendered);
            $("div#pioneer").show();

            // Add click event for this particular pioneers "show all" link.
            $("div#pioneer a.all_achievements").click((e: Event) => {
                e.preventDefault();
                this.allAchievements();
            });

            $("div#pioneer").on("click", "a.close", (e: Event) => {
                e.preventDefault();
                this.close();
            });

            $(document).on("keyup", (e: KeyboardEvent) => {
                if (e.keyCode === 27) {
                    this.close();
                }
            });
        });
    }

    public close(): void {
        $(document).off("keyup"); // Risky. Should be supplying exact function to unbind but current Typescript does not seem to support that.
        $("div#pioneer").off("click", "a.close")
                        .hide();
    }

    public allAchievements(): void {
        $.get(`/people/${this.details.id}/achievements`, (resp: {achievements: Array<Structure.Achievement>}) => {
            $.get('/static/templates/achievements.mst', (template: string) => {
                let rendered = Mustache.render(template, {
                    achievements: resp.achievements, 
                    rating: this.rating,
                    parseDescription: Helpers.parseDescription,
                });

                $("div#pioneer_overlay ul.person_achievements").html(rendered);
                $("div#pioneer_overlay a.all_achievements").hide();
            });
        }, "json");
    }

    private rating(): (text: string, render: (s: string) => string) => string {
        return (text: string, render: (s: string) => string) => {
            let impact = parseInt(render(text));

            return [1,2,3,4,5].map((n) => {
                return `<div class="${(impact >= n) ? "on" : "none"}"></div>`;
            }).join("");
        }
    }
}
