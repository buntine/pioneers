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
 // gender: string;
 //impact: number;
// biography: string;
// picture: string;
// source: string;
// yob: number;
// yod: number;
  wins: Array<IWin>;
  achievements: Array<IAchievement>;
}

class Person implements IPerson {
  constructor(public name: string, public country: string, public achievements: Array<any>, public wins: Array<any>) {
    this.name = name;
    this.country = country;
    this.achievements = $.map(achievements, (a:any) => {return <IAchievement>a;})
    this.wins = $.map(wins, (a:any) => {return <IWin>a;})
  }

  test() {
    return "Hello " + this.name;
  }
}

$(function(){
  $.getJSON("/people", {"tag": ["www", "internet"], "op": "OR"},
    (d:any) => {
      let people: Person[] = $.map(d.people, (p:any) => {
        return new Person(p.name, p.country, p.achievements, p.wins)
      });

      console.log(people[0].test());
    }
  );
});
