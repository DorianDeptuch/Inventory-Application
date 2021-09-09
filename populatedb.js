#! /usr/bin/env node

console.log(
  "This script populates some test dogs, breeders, breeds and locations to your database. Specified database as argument - e.g.: populatedb mongodb+srv://cooluser:coolpassword@cluster0.a9azn.mongodb.net/local_library?retryWrites=true"
);

// Get arguments passed on command line
var userArgs = process.argv.slice(2);
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/
var async = require("async");
var Dog = require("./models/dog");
var Breeder = require("./models/breeder");
var Location = require("./models/location");
var Breed = require("./models/breed");

var mongoose = require("mongoose");
var mongoDB = userArgs[0];
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

var breeders = [];
var locations = [];
var dogs = [];
var breeds = [];

function breederCreate(
  name,
  established,
  location,
  specialty,
  description,
  photoURL,
  cb
) {
  breederdetail = {
    name,
    location,
    specialty,
    description,
    photoURL,
  };
  if (established != false) breederdetail.established = established;

  var breeder = new Breeder(breederdetail);

  breeder.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log("New Breeder: " + breeder);
    breeders.push(breeder);
    cb(null, breeder);
  });
}

function locationCreate(name, description, cb) {
  locationdetail = { name: name, description: description };

  var location = new Location(locationdetail);

  location.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log("New Location: " + location);
    locations.push(location);
    cb(null, location);
  });
}

function dogCreate(
  name,
  breed,
  breeder,
  location,
  description,
  temperment,
  neuteredSpayed,
  age,
  sex,
  adoptionFee,
  cb
) {
  dogdetail = {
    name: name,
    breed: breed,
    breeder: breeder,
    location: location,
    description: description,
    temperment: temperment,
    neuteredSpayed: neuteredSpayed,
    age: age,
    sex: sex,
    adoptionFee: adoptionFee,
  };
  if (neuteredSpayed != false) dogdetail.neuteredSpayed = neuteredSpayed;

  var dog = new Dog(dogdetail);
  dog.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log("New Dog: " + dog);
    dogs.push(dog);
    cb(null, dog);
  });
}

function breedCreate(name, size, description, cb) {
  breeddetail = {
    name: name,
    size: size,
    description: description,
  };
  // if (due_back != false) breeddetail.due_back = due_back
  // if (status != false) breeddetail.status = status

  var breed = new Breed(breeddetail);
  breed.save(function (err) {
    if (err) {
      console.log("ERROR CREATING Breed: " + breed);
      cb(err, null);
      return;
    }
    console.log("New Breed: " + breed);
    breeds.push(breed);
    cb(null, breed);
  });
}

function createBreeders(cb) {
  async.series(
    [
      function (callback) {
        breederCreate(
          "Canine Coach",
          "2019-10-02",
          locations[0],
          "Pet",
          "A Southern California Based Dog Breeder That Provides The Very Best Pets To Dedicated Dog Owners Throughout The US And Beyond. ",
          "",
          callback
        );
      },
      function (callback) {
        breederCreate(
          "The Red Paw",
          "2004-05-11",
          locations[2],
          "Service",
          "A Miami based service animal bredding service that will help find you a best friend to help you with your everyday needs",
          "",
          callback
        );
      },
      function (callback) {
        breederCreate(
          "Grover's Hounds",
          "1976-08-12",
          locations[3],
          "Hunting",
          "Here at Grovers, we breed the best of the best of hunting dogs that will catch what you kill, guaranteed.",
          "",
          callback
        );
      },
      function (callback) {
        breederCreate(
          "Joanne's Standard",
          "1997-04-23",
          locations[1],
          "Showdog",
          "Is Westminster in your sights? Well look no further, Joanne and associates will get your dog show ready in no time!",
          "",
          callback
        );
      },
      function (callback) {
        breederCreate(
          "Killer K9",
          "2011-11-17",
          locations[4],
          "Protection",
          "We breed only the best protection dogs this side of the Mississippi. Consider these animals as your personal form of furry secret service",
          "",
          callback
        );
      },
    ],
    // optional callback
    cb
  );
}

function createLocations(cb) {
  async.series(
    [
      function (callback) {
        locationCreate(
          "San Diego",
          "The climate of San Diego, California is classified as a Mediterranean climate. The basic climate features hot, sunny, and dry summers, and cooler, wetter winters. However, San Diego is much more arid than typical Mediterranean climates, and winters are still dry compared with most other zones with this type of climate. Dogs with shorter coats will do well here. Popular Breeds in the area include: Boxers, Chihuahuas, Dalmatians, Rottweilers, Pit Bulls, Pembroke Welsh Corgis, Pugs, Beagles",
          callback
        );
      },
      function (callback) {
        locationCreate(
          "Seattle",
          'The climate of Seattle is temperate, classified in the Mediterranean zone by the main climatic classification but some sources put the city in the oceanic zone. It has cool, wet winters and mild, relatively dry summers, covering characteristics of both. The climate is sometimes characterized as a "modified Mediterranean" climate because it is cooler and wetter than a "true" Mediterranean climate, but shares the characteristic dry summer (which has a strong influence on the region\'s vegetation). Popular breeds in this area include: Laborador Retriever, Golden Retriever, Pembroke Welsh Corgi, French Bulldog, German Shepard, Poodle, Havanese, Bernese Mountain Dog',
          callback
        );
      },
      function (callback) {
        locationCreate(
          "Miami",
          "The climate of Miami is classified as having a tropical monsoon climate with hot and humid summers; short, warm winters; and a marked drier season in the winter. Its sea-level elevation, coastal location, position just above the Tropic of Cancer, and proximity to the Gulf Stream shape its climate. Popular breeds in this area include: Chihuahuas, Golden Retrievers, French Bulldogs, Huskies, Dachshunds, Schnauzers, Mutts, Malteses",
          callback
        );
      },
      function (callback) {
        locationCreate(
          "Detroit",
          "Detroit and the rest of southeastern Michigan have a hot-summer humid continental climate which is influenced by the Great Lakes like other places in the state.  Winters are cold, with moderate snowfall and temperatures not rising above freezing on an average 44 days annually, while dropping to or below 0 °F (−18 °C) on an average 4.4 days a year; summers are warm to hot with temperatures exceeding 90 °F (32 °C) on 12 days. Popular breeds in this area include: Labradoodles, Goldendoodles, Siberian Huskies, American Pit Bull Terriers, Jack Russell Terriers",
          callback
        );
      },
      function (callback) {
        locationCreate(
          "New York",
          "The climate of New York City features a humid subtropical variety, with parts of the city transitioning into a humid continental climate. This gives the city cold, wet winters and hot, humid summers with plentiful rainfall all year round. Popular breeds in this area include: Golden Retrievers, Pitbulls, Shih Tzus, Lab Mixes, Goldendoodles, French Bulldogs, Mutts, Malteses",
          callback
        );
      },
    ],
    //optional callback
    cb
  );
}

function createBreeds(cb) {
  async.series(
    [
      function (callback) {
        breedCreate(
          "Jack Russel Terrier",
          "Small",
          "Upbeat, lively, inquisitive, and friendly, the jaunty Russell Terrier was developed by England's \"Sporting Parson\" for use in foxhunts. The adorable Russell Terrier looks like a plush toy come to life but is an eager, tireless working terrier. These jaunty little fellows pack lots of personality into a compact, rectangular body standing 10 to 12 inches at the shoulder. Their dark, almond-shaped eyes and mobile V-shaped ears bring out the keenly intelligent expression'an endearing hallmark of the breed. All three coat types are mostly white with markings that are tan or black, or both. Russells move with a free, effortless gait that announces the breed's innate confidence.",
          callback
        );
      },
      function (callback) {
        breedCreate(
          "German Shephard",
          "Large",
          "Generally considered dogkind's finest all-purpose worker, the German Shepherd Dog is a large, agile, muscular dog of noble character and high intelligence. Loyal, confident, courageous, and steady, the German Shepherd is truly a dog lover's delight. German Shepherd Dogs can stand as high as 26 inches at the shoulder and, when viewed in outline, presents a picture of smooth, graceful curves rather than angles. The natural gait is a free-and-easy trot, but they can turn it up a notch or two and reach great speeds. There are many reasons why German Shepherds stand in the front rank of canine royalty, but experts say their defining attribute is character: loyalty, courage, confidence, the ability to learn commands for many tasks, and the willingness to put their life on the line in defense of loved ones. German Shepherds will be gentle family pets and steadfast guardians, but, the breed standard says, there's a certain aloofness that does not lend itself to immediate and indiscriminate friendships.",
          callback
        );
      },
      function (callback) {
        breedCreate(
          "Rottweiler",
          "Large",
          "The Rottweiler is a robust working breed of great strength descended from the mastiffs of the Roman legions. A gentle playmate and protector within the family circle, the Rottie observes the outside world with a self-assured aloofness. A male Rottweiler will stand anywhere from 24 to 27 muscular inches at the shoulder; females run a bit smaller and lighter. The glistening, short black coat with smart rust markings add to the picture of imposing strength. A thickly muscled hindquarters powers the Rottie's effortless trotting gait. A well-bred and properly raised Rottie will be calm and confident, courageous but not unduly aggressive. The aloof demeanor these world-class guardians present to outsiders belies the playfulness, and downright silliness, that endear Rotties to their loved ones. (No one told the Rottie he's not a toy breed, so he is liable plop onto your lap for a cuddle.) Early training and socialization will harness a Rottie's territorial instincts in a positive way.",
          callback
        );
      },
      function (callback) {
        breedCreate(
          "Siberian Husky",
          "Large",
          "Siberian Husky, a thickly coated, compact sled dog of medium size and great endurance, was developed to work in packs, pulling light loads at moderate speeds over vast frozen expanses. Sibes are friendly, fastidious, and dignified. The graceful, medium-sized Siberian Husky's almond-shaped eyes can be either brown or blue'and sometimes one of each'and convey a keen but amiable and even mischievous expression. Quick and nimble-footed, Siberians are known for their powerful but seemingly effortless gait. Tipping the scales at no more than 60 pounds, they are noticeably smaller and lighter than their burly cousin, the Alaskan Malamute. As born pack dogs, they enjoy family life and get on well with other dogs. The Sibe's innate friendliness render them indifferent watchdogs. These are energetic dogs who can't resist chasing small animals, so secure running room is a must. An attractive feature of the breed: Sibes are naturally clean, with little doggy odor.",
          callback
        );
      },
      function (callback) {
        breedCreate(
          "Chihuahua",
          "Small",
          'The Chihuahua is a tiny dog with a huge personality. A national symbol of Mexico, these alert and amusing "purse dogs" stand among the oldest breeds of the Americas, with a lineage going back to the ancient kingdoms of pre-Columbian times. The Chihuahua is a balanced, graceful dog of terrier-like demeanor, weighing no more than 6 pounds. The rounded "apple" head is a breed hallmark. The erect ears and full, luminous eyes are acutely expressive. Coats come in many colors and patterns, and can be long or short. The varieties are identical except for coat. Chihuahuas possess loyalty, charm, and big-dog attitude. Even tiny dogs require training, and without it this clever scamp will rule your household like a little Napoleon. Compact and confident, Chihuahuas are ideal city pets. They are too small for roughhousing with kids, and special care must be taken in cold weather, but Chihuahuas are adaptable\'as long as they get lots of quality time in their preferred lap.',
          callback
        );
      },
      function (callback) {
        breedCreate(
          "Shih Tzu",
          "Small",
          "That face! Those big dark eyes looking up at you with that sweet expression! It's no surprise that Shih Tzu owners have been so delighted with this little 'Lion Dog' for a thousand years. Where Shih Tzu go, giggles and mischief follow. Shi Tsu (pronounced in the West 'sheed-zoo' or 'sheet-su'; the Chinese say 'sher-zer'), weighing between 9 to 16 pounds, and standing between 8 and 11 inches, are surprisingly solid for dogs their size. The coat, which comes in many colors, is worth the time you will put into it'few dogs are as beautiful as a well-groomed Shih Tzu. Being cute is a way of life for this lively charmer. The Shih Tzu is known to be especially affectionate with children. As a small dog bred to spend most of their day inside royal palaces, they make a great pet if you live in an apartment or lack a big backyard. Some dogs live to dig holes and chase cats, but a Shih Tzu's idea of fun is sitting in your lap acting adorable as you try to watch TV.",
          callback
        );
      },
      function (callback) {
        breedCreate(
          "Welsh Corgi",
          "Small",
          "Among the most agreeable of all small housedogs, the Pembroke Welsh Corgi is a strong, athletic, and lively little herder who is affectionate and companionable without being needy. They are one the world's most popular herding breeds. At 10 to 12 inches at the shoulder and 27 to 30 pounds, a well-built male Pembroke presents a big dog in a small package. Short but powerful legs, muscular thighs, and a deep chest equip him for a hard day's work. Built long and low, Pembrokes are surprisingly quick and agile. They can be red, sable, fawn, and black and tan, with or without white markings. The Pembroke is a bright, sensitive dog who enjoys play with his human family and responds well to training. As herders bred to move cattle, they are fearless and independent. They are vigilant watchdogs, with acute senses and a 'big dog' bark. Families who can meet their bold but kindly Pembroke's need for activity and togetherness will never have a more loyal, loving pet.",
          callback
        );
      },
      function (callback) {
        breedCreate(
          "French Bulldog",
          "Small",
          "The one-of-a-kind French Bulldog, with his large bat ears and even disposition, is one of the world's most popular small-dog breeds, especially among city dwellers. The Frenchie is playful, alert, adaptable, and completely irresistible. The French Bulldog resembles a Bulldog in miniature, except for the large, erect 'bat ears' that are the breed's trademark feature. The head is large and square, with heavy wrinkles rolled above the extremely short nose. The body beneath the smooth, brilliant coat is compact and muscular. The bright, affectionate Frenchie is a charmer. Dogs of few words, Frenchies don't bark much'but their alertness makes them excellent watchdogs. They happily adapt to life with singles, couples, or families, and do not require a lot of outdoor exercise. They get on well with other animals and enjoy making new friends of the human variety. It is no wonder that city folk from Paris to Peoria swear by this vastly amusing and companionable breed.",
          callback
        );
      },
      function (callback) {
        breedCreate(
          "Poodle",
          "Medium",
          'Whether Standard, Miniature, or Toy, and either black, white, or apricot, the Poodle stands proudly among dogdom’s true aristocrats. Beneath the curly, low-allergen coat is an elegant athlete and companion for all reasons and seasons. Poodles come in three size varieties: Standards should be more than 15 inches tall at the shoulder; Miniatures are 15 inches or under; Toys stand no more than 10 inches. All three varieties have the same build and proportions. At dog shows, Poodles are usually seen in the elaborate Continental Clip. Most pet owners prefer the simpler Sporting Clip, in which the coat is shorn to follow the outline of the squarely built, smoothly muscled body. Forget those old stereotypes of Poodles as sissy dogs. Poodles are eager, athletic, and wickedly smart "real dogs" of remarkable versatility. The Standard, with his greater size and strength, is the best all-around athlete of the family, but all Poodles can be trained with great success.',
          callback
        );
      },
      function (callback) {
        breedCreate(
          "Laborador Retriever",
          "Large",
          "The sweet-faced, lovable Labrador Retriever is America's most popular dog breed. Labs are friendly, outgoing, and high-spirited companions who have more than enough affection to go around for a family looking for a medium-to-large dog. The sturdy, well-balanced Labrador Retriever can, depending on the sex, stand from 21.5 to 24.5 inches at the shoulder and weigh between 55 to 80 pounds. The dense, hard coat comes in yellow, black, and a luscious chocolate. The head is wide, the eyes glimmer with kindliness, and the thick, tapering 'otter tail' seems to be forever signaling the breed's innate eagerness. Labs are famously friendly. They are companionable housemates who bond with the whole family, and they socialize well with neighbor dogs and humans alike. But don't mistake his easygoing personality for low energy: The Lab is an enthusiastic athlete that requires lots of exercise, like swimming and marathon games of fetch, to keep physically and mentally fit.",
          callback
        );
      },
      function (callback) {
        breedCreate(
          "Dachshund",
          "Small",
          "The famously long, low silhouette, ever-alert expression, and bold, vivacious personality of the Dachshund have made him a superstar of the canine kingdom. Dachshunds come in two sizes and in three coat types of various colors and patterns. The word 'icon' is terribly overworked, but the Dachshund'with his unmistakable long-backed body, little legs, and big personality'is truly an icon of purebred dogdom. Dachshunds can be standard-sized (usually 16 to 32 pounds) or miniature (11 pounds or under), and come in one of three coat types: smooth, wirehaired, or longhaired. Dachshunds aren't built for distance running, leaping, or strenuous swimming, but otherwise these tireless hounds are game for anything. Smart and vigilant, with a big-dog bark, they make fine watchdogs. Bred to be an independent hunter of dangerous prey, they can be brave to the point of rashness, and a bit stubborn, but their endearing nature and unique look has won millions of hearts the world over.",
          callback
        );
      },
      function (callback) {
        breedCreate(
          "Maltese",
          "Small",
          "The tiny Maltese, 'Ye Ancient Dogge of Malta,' has been sitting in the lap of luxury since the Bible was a work in progress. Famous for their show-stopping, floor-length coat, Maltese are playful, charming, and adaptable toy companions. Maltese are affectionate toy dogs weighing less than seven pounds, covered by a long, straight, silky coat. Beneath the all-white mantle is a compact body moving with a smooth and effortless gait. The overall picture depicts free-flowing elegance and balance. The irresistible Maltese face'with its big, dark eyes and black gumdrop nose'can conquer the most jaded sensibility. Despite their aristocratic bearing, Maltese are hardy and adaptable pets. They make alert watchdogs who are fearless in a charming toy-dog way, and they are game little athletes on the agility course. Maltese are low-shedding, long-lived, and happy to make new friends of all ages. Sometimes stubborn and willful, they respond well to rewards-based training.",
          callback
        );
      },
      function (callback) {
        breedCreate(
          "Cocker Spaniel",
          "Small",
          "The merry and frolicsome Cocker Spaniel, with his big, dreamy eyes and impish personality, is one of the world's best-loved breeds. They were developed as hunting dogs, but Cockers gained their wide popularity as all-around companions. Those big, dark eyes; that sweet expression; those long, lush ears that practically demand to be touched'no wonder the Cocker spent years as America's most popular breed. The Cocker is the AKC's smallest sporting spaniel, standing about 14 to 15 inches. The coat comes in enough colors and patterns to please any taste. The well-balanced body is sturdy and solid, and these quick, durable gundogs move with a smooth, easy gait. Cockers are eager playmates for kids and are easily trained as companions and athletes. They are big enough to be sporty, but compact enough to be portable. A Cocker in full coat rewards extra grooming time by being the prettiest dog on the block. These energetic sporting dogs love playtime and brisk walks.",
          callback
        );
      },
      function (callback) {
        breedCreate(
          "Saint Bernard",
          "Extra-Large",
          "The Saint Bernard does not rank very high in AKC registrations, but the genial giant of the Swiss Alps is nonetheless among the world's most famous and beloved breeds. Saints are famously watchful and patient 'nanny dogs' for children. Not ranked particularly high in AKC registrations, this genial giant is nonetheless among the world's most famous and beloved breeds. The Saint's written standard abounds with phrases like 'very powerful,' 'extraordinarily muscular,' 'imposing,' and 'massive.' A male stands a minimum 27.5 inches at the shoulder; females will be smaller and more delicately built. The huge head features a wrinkled brow, a short muzzle, and dark eyes, combining to give Saints the intelligent, friendly expression that was such a welcome sight to stranded Alpine travelers.",
          callback
        );
      },
      function (callback) {
        breedCreate(
          "Boston Terrier",
          "Small",
          "The Boston Terrier is a lively little companion recognized by his tight tuxedo jacket, sporty but compact body, and the friendly glow in his big, round eyes. His impeccable manners have earned him the nickname 'The American Gentleman.' Boston Terriers are compact, short-tailed, well-balanced little dogs weighing no more than 25 pounds. The stylish 'tuxedo' coat can be white and either black, brindle, or seal (dark brown). The head is square, the muzzle is short, and the large, round eyes can shine with kindness, curiosity, or mischief. Ever alert to their surroundings, Bostons move with a jaunty, rhythmic step. It's a safe bet that a breed named for a city'the Havanese or Brussels Griffon, for instance'will make an excellent urban pet. Bostons are no exception: they are sturdy but portable, people-oriented, and always up for a brisk walk to the park or outdoor cafe. A bright dog with a natural gift for comedy, the dapper Bostonian is a steady source of smiles.",
          callback
        );
      },
      function (callback) {
        breedCreate(
          "Golden Retriever",
          "Large",
          "The Golden Retriever, an exuberant Scottish gundog of great beauty, stands among America's most popular dog breeds. They are serious workers at hunting and field work, as guides for the blind, and in search-and-rescue, enjoy obedience and other competitive events, and have an endearing love of life when not at work. The Golden Retriever is a sturdy, muscular dog of medium size, famous for the dense, lustrous coat of gold that gives the breed its name. The broad head, with its friendly and intelligent eyes, short ears, and straight muzzle, is a breed hallmark. In motion, Goldens move with a smooth, powerful gait, and the feathery tail is carried, as breed fanciers say, with a 'merry action.' The most complete records of the development of the Golden Retriever are included in the record books that were kept from 1835 until about 1890 by the gamekeepers at the Guisachan (pronounced Gooeesicun) estate of Lord Tweedmouth at Inverness-Shire, Scotland. These records were released to public notice in Country Life in 1952, when Lord Tweedmouth's great-nephew, the sixth Earl of Ilchester, historian and sportsman, published material that had been left by his ancestor. They provided factual confirmation to the stories that had been handed down through generations. Goldens are outgoing, trustworthy, and eager-to-please family dogs, and relatively easy to train. They take a joyous and playful approach to life and maintain this puppyish behavior into adulthood. These energetic, powerful gundogs enjoy outdoor play. For a breed built to retrieve waterfowl for hours on end, swimming and fetching are natural pastimes.",
          callback
        );
      },
      function (callback) {
        breedCreate(
          "Pitbull",
          "Large",
          "The American Staffordshire Terrier, known to their fans as AmStaffs, are smart, confident, good-natured companions. Their courage is proverbial. A responsibly bred, well-socialized AmStaff is a loyal, trustworthy friend to the end. AmStaffs are stocky, muscular bull-type terriers standing 17 to 19 inches at the shoulder. The head is broad, the jaws well defined, the cheekbones pronounced, and the dark, round eyes are set wide apart. AmStaff movement is agile and graceful, with a springy gait that advertises the breed's innate confidence. The stiff, glossy coat comes in many colors and patterns. AmStaffers describe their dogs as keenly aware of their surroundings, game for anything, and lovable 'personality dogs' around the house. AmStaffs like mental and physical challenges. They are highly trainable, as their many forays into showbiz suggest. When acquiring an AmStaff, there's only one way to go: Do your homework and find a responsible AKC breeder.",
          callback
        );
      },
      function (callback) {
        breedCreate(
          "Boxer",
          "Medium",
          "Loyalty, affection, intelligence, work ethic, and good looks: Boxers are the whole doggy package. Bright and alert, sometimes silly, but always courageous, the Boxer has been among America's most popular dog breeds for a very long time. A well-made Boxer in peak condition is an awesome sight. A male can stand as high as 25 inches at the shoulder; females run smaller. Their muscles ripple beneath a short, tight-fitting coat. The dark brown eyes and wrinkled forehead give the face an alert, curious look. The coat can be fawn or brindle, with white markings. Boxers move like the athletes they are named for: smooth and graceful, with a powerful forward thrust. Boxers are upbeat and playful. Their patience and protective nature have earned them a reputation as a great dog with children. They take the jobs of watchdog and family guardian seriously and will meet threats fearlessly. Boxers do best when exposed to a lot of people and other animals in early puppyhood.",
          callback
        );
      },
      function (callback) {
        breedCreate(
          "Australian Shepherd",
          "Medium",
          "The Australian Shepherd, a lean, tough ranch dog, is one of those 'only in America' stories: a European breed perfected in California by way of Australia. Fixtures on the rodeo circuit, they are closely associated with the cowboy life. The Australian Shepherd, the cowboy's herding dog of choice, is a medium-sized worker with a keen, penetrating gaze in the eye. Aussie coats offer different looks, including merle (a mottled pattern with contrasting shades of blue or red). In all ways, they're the picture of rugged and agile movers of stock. Aussies exhibit an irresistible impulse to herd, anything: birds, dogs, kids. This strong work drive can make Aussies too much dog for a sedentary pet owner. Aussies are remarkably intelligent, quite capable of hoodwinking an unsuspecting novice owner. In short, this isn't the pet for everyone. But if you're looking for a brainy, tireless, and trainable partner for work or sport, your search might end here.",
          callback
        );
      },
    ],
    // Optional callback
    cb
  );
}

function createDogs(cb) {
  async.parallel(
    [
      function (callback) {
        dogCreate(
          "Sputnik",
          breeds[0],
          breeders[0],
          locations[0],
          "Full of energy and a great dog to have around. Will bring a family lots of joy!",
          "Neutral",
          false,
          1,
          "Male",
          300,
          callback
        );
      },
      function (callback) {
        dogCreate(
          "Kiera",
          breeds[1],
          breeders[0],
          locations[0],
          "A well trained and loving dog. This dog cares more about you than anything else in the world",
          "Assertive",
          true,
          2,
          "Female",
          500,
          callback
        );
      },
      function (callback) {
        dogCreate(
          "Dexter",
          breeds[5],
          breeders[1],
          locations[1],
          "A quirky but well-mannered dog.",
          "Passive",
          true,
          3,
          "Female",
          50,
          callback
        );
      },
      function (callback) {
        dogCreate(
          "Shadow",
          breeds[4],
          breeders[3],
          locations[3],
          "One of the sharpest dogs out there.",
          "Assertive",
          false,
          2,
          "Female",
          400,
          callback
        );
      },
      function (callback) {
        dogCreate(
          "Nova",
          breeds[9],
          breeders[2],
          locations[2],
          "A loving dog that you will cherish",
          "Neutral",
          false,
          4,
          "Male",
          250,
          callback
        );
      },
      function (callback) {
        dogCreate(
          "Drax",
          breeds[10],
          breeders[4],
          locations[4],
          "A lovable goofball",
          "Assertive",
          true,
          0,
          "Female",
          300,
          callback
        );
      },
      function (callback) {
        dogCreate(
          "Mochi",
          breeds[11],
          breeders[0],
          locations[0],
          "One of the best family dogs you will meet",
          "Passive",
          false,
          7,
          "Male",
          100,
          callback
        );
      },
      function (callback) {
        dogCreate(
          "Ninja",
          breeds[12],
          breeders[4],
          locations[4],
          "This dog is the definition of a chill dog",
          "Passive",
          true,
          5,
          "Male",
          150,
          callback
        );
      },
      function (callback) {
        dogCreate(
          "Bella",
          breeds[13],
          breeders[3],
          locations[3],
          "The lovable giant. This dog will smother you with cuddles",
          "Neutral",
          true,
          1,
          "Male",
          100,
          callback
        );
      },
      function (callback) {
        dogCreate(
          "Otis",
          breeds[16],
          breeders[1],
          locations[1],
          "This dog is quite the smart cookie",
          "Assertive",
          false,
          2,
          "Female",
          350,
          callback
        );
      },
      function (callback) {
        dogCreate(
          "Shrek",
          breeds[17],
          breeders[2],
          locations[2],
          "This dog is quite literally full of love",
          "Neutral",
          false,
          0,
          "Female",
          200,
          callback
        );
      },
      function (callback) {
        dogCreate(
          "Buckley",
          breeds[15],
          breeders[0],
          locations[0],
          "Don't let the size fool you, this dog is the package",
          "Assertive",
          true,
          2,
          "Male",
          150,
          callback
        );
      },
      function (callback) {
        dogCreate(
          "Champ",
          breeds[8],
          breeders[1],
          locations[1],
          "Aptly named, this dog will be the champion in your life",
          "Neutral",
          true,
          3,
          "Male",
          450,
          callback
        );
      },
    ],
    // optional callback
    cb
  );
}

async.series(
  [createLocations, createBreeders, createBreeds, createDogs],
  // Optional callback
  function (err, results) {
    if (err) {
      console.log("FINAL ERR: " + err);
    } else {
      console.log("Dogs: " + dogs);
    }
    // All done, disconnect from database
    mongoose.connection.close();
  }
);
