'use strict';
var router = require('express').Router();
module.exports = router;
var _ = require('lodash');


var fs = require('fs');

function nGramProfile (author, file) {
    this.author = author;
    this.profile = {};
    if (Array.isArray(file)) {
        for(var i = 0; i < file.length; i++) {
            this.file += fs.readFileSync(file[i].toString());
        }
    } else {
        this.file = fs.readFileSync(file).toString();

    }
    this.createProfile('letter', 2);

    //Create all possible bigrams and place them in profile object
    // for(var a=97; a < 123; a++) {
    //  for (var b=97; b < 123; b++) {
    //      this.profile[String.fromCharCode(a,b)] = 0;
    //  }
    // }

}

nGramProfile.prototype.readFile = function(file) {
    this.file = fs.readFileSync(file).toString();
};

// nGramProfile.prototype.createProfile = function() {
//     for (var i = 0; i < this.file.length - 1; i++) {
//         var letter1 = this.file[i].toLowerCase();
//         var letter2 = this.file[i + 1].toLowerCase();
//         //Check if characters are letters a-z
//         //Increment bigram count in profile object
//         if (letter1.match(/[a-z]/i) !== null && letter2.match(/[a-z]/i) !== null) {
//            this.profile[letter1 + letter2]++;
//         }
//     }
// };

nGramProfile.prototype.createProfile = function (type, ngram) {
    if(type === 'letter') {
        this.createLetterFrequencyProfile(ngram);
    } else if(type === 'word') {
         this.createWordFrequencyProfile(ngram);
    } else {
        return 'Can only create author profile by letter or word frequency';
    }
};

nGramProfile.prototype.createLetterFrequencyProfile = function(ngram) {
    //replacing any non-word character, digit, and underscore with a space
    var file = this.file.toLowerCase().replace(/\W+|\d+|_+/g, " ");
    for (var i = 0; i < file.length - ngram; i++) {
        var str = file.substr(i, ngram);
        //Check if characters are letters a-z
        //Increment bigram count in profile object
        if (!/\s/g.test(str)) {
            if (this.profile[str]) {
                this.profile[str]++;
            } else {
                this.profile[str] = 1;
            }
        }
    }
    this.convertProfileToFrequency();
};

nGramProfile.prototype.createWordFrequencyProfile = function(ngram) {
    var file = this.file.toLowerCase().replace(/\W+|\d+|_+/g, " ");
    var fileWords = file.split(" ");
    for(var i = 0; i < fileWords.length - ngram; i++) {
        if(this.profile[fileWords.slice(i, i+ngram).join(' ')]) {
            this.profile[fileWords.slice(i, i+ngram).join(' ')]++;
        } else {
            this.profile[fileWords.slice(i, i+ngram).join(' ')] = 1;
        }
    }
};


nGramProfile.prototype.getTotalNGramCount = function() {
    var arr = Object.keys(this.profile);
    var total = 0;
    var self = this;
    arr.forEach(function(val) {
        total += self.profile[val];
    });
    return total;
};

nGramProfile.prototype.convertProfileToFrequency = function() {
    var total = this.getTotalNGramCount();
    var arr = Object.keys(this.profile);
    for (var i = 0; i < arr.length; i++) {
        this.profile[arr[i]] = this.profile[arr[i]] / total;
    }
};


nGramProfile.prototype.compareProfiles = function(unknownProfile) {
    var self = this;
    var profileArr = Object.keys(this.profile);
    var unknownArr = Object.keys(unknownProfile.profile);
    var sum = 0;

    //First, I want to add the ngrams that are in the unknown profile to the known profile
    //So that when I loop through the known profile, I am getting every single property between the two objects
    for(var i=0; i < unknownArr.length; i++) {
        if (this.profile[unknownArr[i]] === undefined) {
           profileArr.push(unknownArr[i]);
        }
    }

    profileArr.forEach(function(val) {
        //After I've added all of the properties from the unknownArr to the known profileArr
        //I want to set those new properties to 0 since they were not found in the known text
        var val1 = self.profile[val] !== undefined ? self.profile[val] : 0;
        var val2 = unknownProfile.profile[val] !== undefined ? unknownProfile.profile[val] : 0;
        // console.log(val, val1, val2);
        if (val1 !== 0 && val2 !== 0) {
            sum += Math.pow(((2 * (val1 - val2)) / (val1 + val2)), 2);
        }
    });
    return sum;
};

//Known Authors
var ArthurConanDoyle = new nGramProfile("Arthur Conan Doyle", './text/ArthurConanDoyle-TheAdventuresOfSherlockHolmes.txt');
// console.log(ArthurConanDoyle.profile);
var JaneAusten = new nGramProfile("Jane Austen", './text/JaneAusten-PrideAndPrejudice.txt');
var MarkTwain = new nGramProfile("Mark Twain", './text/MarkTwain-AdventuresOfHuckleberryFinn.txt');
var JamesJoyce = new nGramProfile("James Joyce", './text/JamesJoyce-Ulysses.txt');
var WilliamShakespeare = new nGramProfile("William Shakespeare", './text/WilliamShakespeare-Hamlet.txt');
var LewisCarroll = new nGramProfile("Lewis Carroll", './text/LewisCarroll-AlicesAdventuresInWonderland.txt');
var CharlesDickens = new nGramProfile("Charles Dickens", ['./text/CharlesDickens-ATaleOfTwoCities.txt','./text/CharlesDickens-DavidCopperfield.txt']);
var AnthonyTrollope = new nGramProfile("Anthony Trollope", './text/AnthonyTrollope-TheWarden.txt');


/* TESTS */
// var unknownProfile = new nGramProfile("Mark Twain", './text/MarkTwain-TheAdventuresOfTomSawyer.txt');
// var unknownProfile = new nGramProfile("Jane Austen", './text/JaneAusten-Emma.txt');
// var unknownProfile = new nGramProfile("Jane Austen", './text/JaneAusten-SenseAndSensibility.txt');
// var unknownProfile = new nGramProfile("William Shakespeare", './text/WilliamShakespeare-Macbeth.txt');
// var unknownProfile = new nGramProfile("Lewis Carroll", './text/LewisCarroll-ThroughTheLookingGlass.txt');
// var unknownProfile = new nGramProfile("Charles Dickens", './text/CharlesDickens-OliverTwist.txt');
// var unknownProfile = new nGramProfile("Charles Dickens", './text/CharlesDickens-GreatExpectations.txt');
// var unknownProfile = new nGramProfile("Anthony Trollope", './text/AnthonyTrollope-DoctorThorne.txt');
// var unknownProfile = new nGramProfile("Arthur Conan Doyle", './text/ArthurConanDoyle-TheHoundOfTheBaskervilles.txt');
// var unknownProfile = new nGramProfile("Arthur Conan Doyle", './text/ArthurConanDoyle-AStudyInScarlet.txt');
// var unknownProfile = new nGramProfile("James Joyce", './text/JamesJoyce-Dubliners.txt');

function AuthorProfiles(authors) {
    this.authors = authors;
    // console.log(this.authors[0].author);
}

AuthorProfiles.prototype.determineAuthor = function (file) {
    var nGramProf = new nGramProfile("Unknown", file);
    var min = 0;
    var predictedAuthor;
    var dissimilarity = 0;
    for(var i = 0; i < this.authors.length; i++) {
        dissimilarity = this.authors[i].compareProfiles(nGramProf);
        // console.log("dissimilarity for " + this.authors[i].author, dissimilarity);
        if (i === 0 || dissimilarity < min) {
            min = dissimilarity;
            predictedAuthor = this.authors[i].author;
        }
    }
    return predictedAuthor;
};

var knownProfiles = new AuthorProfiles([ArthurConanDoyle, JaneAusten, MarkTwain, JamesJoyce, WilliamShakespeare, LewisCarroll, CharlesDickens, AnthonyTrollope]);
// console.log("Tom Sawyer:", knownProfiles.determineAuthor('./text/MarkTwain-TheAdventuresOfTomSawyer.txt'));
// console.log("Emma:", knownProfiles.determineAuthor('./text/JaneAusten-Emma.txt'));
// console.log("Sense & Sensibility:", knownProfiles.determineAuthor('./text/JaneAusten-SenseAndSensibility.txt'));
// console.log("Macbeth:", knownProfiles.determineAuthor('./text/WilliamShakespeare-Macbeth.txt'));
// console.log("Through The Looking Glass:", knownProfiles.determineAuthor('./text/LewisCarroll-ThroughTheLookingGlass.txt'));
// console.log("Oliver Twist:", knownProfiles.determineAuthor('./text/CharlesDickens-OliverTwist.txt'));
// console.log("Great Expectations:", knownProfiles.determineAuthor('./text/CharlesDickens-GreatExpectations.txt'));
// console.log("Doctor Thorne:", knownProfiles.determineAuthor('./text/AnthonyTrollope-DoctorThorne.txt'));
// console.log("The Hound Of The Baskervilles:", knownProfiles.determineAuthor('./text/ArthurConanDoyle-TheHoundOfTheBaskervilles.txt'));
// console.log("A Study In Scarlet:", knownProfiles.determineAuthor('./text/ArthurConanDoyle-AStudyInScarlet.txt'));
// console.log("Dubliners:", knownProfiles.determineAuthor('./text/JamesJoyce-Dubliners.txt'));
// console.log("Ulysses:", knownProfiles.determineAuthor('./text/JamesJoyce-Ulysses.txt'));









// console.log("Unknown Text is by " + unknownProfile.author);
// console.log("Arthur Conan Doyle", ArthurConanDoyle.compareProfiles(unknownProfile));
// console.log("Jane Austen", JaneAusten.compareProfiles(unknownProfile));
// console.log("Mark Twain", MarkTwain.compareProfiles(unknownProfile));
// console.log("James Joyce", JamesJoyce.compareProfiles(unknownProfile));
// console.log("William Shakespeare", WilliamShakespeare.compareProfiles(unknownProfile));
// console.log("Lewis Carroll", LewisCarroll.compareProfiles(unknownProfile));
// console.log("Charles Dickens", CharlesDickens.compareProfiles(unknownProfile));
// console.log("Anthony Trollope", AnthonyTrollope.compareProfiles(unknownProfile));


router.get('/:unknownText', function (req, res, next) {
    // console.log(knownProfiles);
    var authorGuess = knownProfiles.determineAuthor('./text/'+req.params.unknownText+'.txt')
    res.json(authorGuess);
});