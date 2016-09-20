# The Pioneers of Computer Science

An interactive study of the people, and their impact, in the field of computer science. *The Pioneers of Computer Science* allows you to visualize the "who", "what" and "where" of contributions based on any set of topics in the field.

[computerpionee.rs](http://computerpionee.rs/)

## Data

The pioneer data that populates this website was collected via research from many sources across the World Wide Web, rewritten into my own words and reformatted where appropriate. I hereby provide this collated data in CSV format to the community for use in further projects:

* [pioneers.zip](/data/dist/pioneers.zip)

If you make something cool, please send me a link. Happy hacking!

## Accuracy / Disclaimer

It's always a little risky to "rank" people in terms of their importance. And, although I've tried to be fair, I feel compelled to declare that this website is simply intended to celebrate the achievements of the masters of our field and is no way attempting to belittle any one persons effort relative to anothers. It should be assumed that this data set will always be *somewhat incomplete and somewhat inaccurate*.

## Running locally / Contributing

Contributions are always more than welcome for both new data and new/improved functionality!

In order to run the app locally, it should just be a matter of:

* Ensure you have Typescript, Python and Sqlite3 installed.
* Install pip if you don't already have it: `$ sudo apt-get install python-pip` (or equivalent for your O/S)
* Install Flask: `$ pip install flask`
* Install Pony ORM: `$ pip install pony`
* Set development flag in shell or ~/.bashrc: `$ export PIONEERSDEVELOPMENT=1`
* Seed database: `$ python app/seed.py`
* Build TypeScript and run server: `$ ./build.sh`
* Go to [http://localhost:5000](http://localhost:5000)

After initial installation, you will only need to `./build.sh` each time you want to test.

## Screenshots

![The Pioneers: Impact](/data/screenshots/impact.png?raw=true "The Pioneers: Impact")
![The Pioneers: Timeline](/data/screenshots/timeline.png?raw=true "The Pioneers: Timeline")
![The Pioneers: Pioneer](/data/screenshots/pioneer.png?raw=true "The Pioneers: Pioneer")
