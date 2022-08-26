const dotenv = require("dotenv");
const mongoose = require('mongoose');

dotenv.config();

mongoose.connect(process.env.DB_URL, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true
})
  .then(() => {
    console.log('Connected to the database')
  })
  .catch((err) => {
    console.error(`Error connecting to the database. ${err}`);
  });
mongoose.Promise = global.Promise;


let personSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: Number,
  favoriteFoods: [String]
});

let Person = mongoose.model('Person', personSchema);

const createAndSavePerson = function (done) {
  let person = new Person({
    name: 'Andres',
    age: 25,
    favoriteFoods: ['pizza', 'hamburguesa'],
  });
  person.save((err, data) => {
    if (err) throw err;
    console.log(data);
    done(null, data);
  });
};

const createManyPeople = function (arrayOfPeople, done) {
  Person.create(arrayOfPeople, (err, people) => {
    if (err) return done(err);
    done(null, people);
  });
};

const findPeopleByName = function (personName, done) {
  Person.find({ name: personName }, (err, data) => {
    if (err) return done(err);
    done(null, data);
  })
};

const findOneByFood = function (food, done) {
  Person.findOne({ favoriteFoods: [food] }, (err, data) => {
    if (err) return done(err);
    done(null, data);
  });
};

const findPersonById = function (personId, done) {
  Person.findById({ _id: [personId] }, (err, data) => {
    if (err) return done(err);
    done(null, data);
  });
};

const findEditThenSave = function (personId, done) {
  const foodToAdd = "hamburger";

  Person.findById(personId, (err, person) => {
    if (err) return done(err);
    person.favoriteFoods.push(foodToAdd);
    person.save((err, person) => {
      if (err) return done(err);
      done(null, person);
    });
  });
};

const findAndUpdate = function (personName, done) {
  const ageToSet = 20;

  Person.findOneAndUpdate(
    { name: personName },
    { age: ageToSet },
    { new: true },
    (err, person) => {
      if (err) return done(err);
      done(null, person);
    }
  );
};

const removeById = function (personId, done) {
  Person.findByIdAndRemove(personId, (err, data) => {
    if (err) return done(err);
    done(null, data);
  });
};

const removeManyPeople = function (done) {
  const nameToRemove = "Mary";

  Person.remove({ name: nameToRemove }, (err, data) => {
    if (err) return done(err);
    done(null, data);
  });
};

const queryChain = (done) => {
  const foodToSearch = "burrito";

  Person.find({ favoriteFoods: foodToSearch })
    .sort({ name: 'asc' })
    .limit(2)
    .select('-age')
    .exec((err, data) => {
      if (err) throw err;
      done(null, data);
    });
};

exports.PersonModel = Person;
exports.createAndSavePerson = createAndSavePerson;
exports.findPeopleByName = findPeopleByName;
exports.findOneByFood = findOneByFood;
exports.findPersonById = findPersonById;
exports.findEditThenSave = findEditThenSave;
exports.findAndUpdate = findAndUpdate;
exports.createManyPeople = createManyPeople;
exports.removeById = removeById;
exports.removeManyPeople = removeManyPeople;
exports.queryChain = queryChain;