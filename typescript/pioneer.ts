class Pioneer {
    public details: Structure.Person;

    public show(): void {
        $.get("/static/templates/person.mst", (template: string) => {
            let rendered = Mustache.render(template, {
                person: this.details, 
                years: this.years(),
                remainingAchievements: () => { return this.details.total_achievements - this.details.achievements.length },
                parseDescription: Helpers.parseDescription,
                rating: Helpers.rating,
                flag: this.flagPath(),
            });
            let pioneer = $("div#pioneer");

            $("div#pioneer_overlay").html(rendered);
            pioneer.show();

            // Add click event for this particular pioneers "show all" link.
            pioneer.find("a.all_achievements").click((e: Event) => {
                e.preventDefault();
                this.allAchievements();
            });

            pioneer.on("click", "a.close", (e: Event) => {
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
            $.get("/static/templates/achievements.mst", (template: string) => {
                let rendered = Mustache.render(template, {
                    achievements: resp.achievements, 
                    rating: Helpers.rating,
                    parseDescription: Helpers.parseDescription,
                });

                $("div#pioneer_overlay ul.person_achievements").html(rendered);
                $("div#pioneer_overlay a.all_achievements").hide();
            });
        }, "json");
    }

    private years(): string {
        if (this.details.yod) {
            return `${this.details.yob} - ${this.details.yod || ""}`;
        } else {
            return `Born in ${this.details.yob}.`;
        }
    }

    public flagPath(): string {
        return Helpers.imageSource("flags", `${this.details.country.toLowerCase().replace(/\W/g, "_")}.png`);
    }
}
