interface IWin {
  name: string;
  year: number;
}

interface IAchievement {
  description: string;
  source: string;
  impact: number;
  year: number;
}

interface IPerson {
  name: string;
  country: string;
  gender: string;
  impact: number;
  biography: string;
  picture: string;
  source: string;
  yob: number;
  yod: number;
  wins: Array<IWin>;
  achievements: Array<IAchievement>;
}

class Person implements IPerson {
  constructor(public name: string, public country: string, public gender: string, public impact: number, public biography: string,
              public picture: string, public source: string, public yob: number, public yod: number,
              public achievements: Array<IAchievement>, public wins: Array<IWin>) {}

  static fromIPerson(p:IPerson) {
    return new Person(p.name, p.country, p.gender, p.impact, p.biography, p.picture,
                      p.source, p.yod, p.yob, p.achievements, p.wins);
  }

  public draw(ctx:CanvasRenderingContext2D, unit:number) : void {
    let radius = (this.impact * unit) / 2.0;
    let img = new Image();

    // Just draw randomly for now until I get the particule system going...
    let x = Math.random() * (ctx.canvas.width - (radius * 2)) + radius;
    let y = Math.random() * (ctx.canvas.height - (radius * 2)) + radius;

    img.src = "/static/images/" + this.picture;

    helpers.onMask(ctx, x, y, radius, () => {
      ctx.drawImage(img, x - radius, y - radius, radius * 2, radius * 2);
    });
  }
}

class People extends Array<Person> {
  private total:number;
  private static delta:number = 1.5;

  constructor() {
    super();
    this.total = 0;
  }

  public push(p:Person) {
    this.total += p.impact;
    return super.push(p);
  }

  public draw(ctx:CanvasRenderingContext2D) : void {
    let cvs = ctx.canvas;
    let unit = Math.min(cvs.width / this.total, cvs.height / this.total) * People.delta;

    for (let p of this) {
      p.draw(ctx, unit);
    }
  }
}
