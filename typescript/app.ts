declare var $:any;

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
              public achievements: Array<IAchievement>, public wins: Array<IWin>) {
    this.name = name;
    this.country = country;
    this.gender = gender;
    this.impact = impact;
    this.biography = biography;
    this.picture = picture;
    this.source = source;
    this.yod = yod;
    this.yob = yob;
    this.achievements = $.map(achievements, (a:IAchievement) => {return <IAchievement>a;})
    this.wins = $.map(wins, (a:IWin) => {return <IWin>a;})
  }

  test() {
    return "Hello " + this.name;
  }
}

$(function(){
  $.getJSON("/people", {"tag": ["www", "internet"], "op": "OR"},
    (d:{people: IPerson}) => {
      let people: Person[] = $.map(d.people, (p:IPerson) => {
        return new Person(p.name, p.country, p.gender, p.impact, p.biography, p.picture,
                          p.source, p.yod, p.yob, p.achievements, p.wins)
      });
    }
  );
});
