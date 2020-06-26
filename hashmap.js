



class hashMap {
  constructor() {
    const startingSpace = 8;
    this._entryRange = startingSpace;
    this._spaceTaken = 0;
    this._entries = new Array(startingSpace);
  }
  addEntry(key, value) {
    //Handle rehash if size too big
    if(this._spaceTaken > (this._entryRange * 0.7)) {
      //Our list of entries is getting cramped.
      this._doubleEntriesSizeAndRehashEntries();
    }
    const entries = this._entries;
    //Otherwise - Keep doing what you are doing
    let hashedValue = _hashString(key, this._entryRange);
    if(!entries[hashedValue]) {
      //Great - no collisions - just slot us in
      //We are filling a previously empty slot and so
      //also need to increment our spaceTaken;
      entries[hashedValue] = {value, key};
      this._spaceTaken++;
      return;
    }
    //We had a collision - so start looking for the next opening
    //or look for an entry with the same key
    while(entries[hashedValue] && entries[hashedValue].key !== key) {
      hashedValue++;
      hashedValue = hashedValue % this._entryRange;
    }
    if(entries[hashedValue]) {
      //We found our key already present!
      // so no need to increment our count
      entries[hashedValue] = {value, key};
    } else {
      console.log("After collision found an empty spot")

      //We are filling a previously empty slot and so need to increment our spaceTaken;
      this._spaceTaken++;
      entries[hashedValue] = {value, key};
    }
  }
  getEntry(key) {
    let hashedValue = _hashString(key, this._entryRange);
    const entries = this._entries;
    if(!entries[hashedValue]) {
      return; //Not in the map for sure!
    }
    while(entries[hashedValue] && entries[hashedValue].key !== key) {
      hashedValue++;
      hashedValue = hashedValue % this._entryRange;
    }
    //We now either stopped the above while loop because we hit an empty spot in the
    //list of entries or because we found what we were looking for.
    if(entries[hashedValue]) return entries[hashedValue].value;
  }

  //Doubles the size of the entries array
  //and rehashes the old values back into the map
  _doubleEntriesSizeAndRehashEntries() {
    const entries = this._entries;
    const oldLength = this._entryRange;
    const newLength = oldLength * 2;
    //Reset the values
    this._entries = new Array(newLength);
    this._entryRange = newLength;
    this._spaceTaken = 0;
    for (let entry of entries) {
      if(!entry) {
        //Make sure we skip empty entries
        continue;
      }
      //Re-insert each entry back into the map
      this.addEntry(entry.key, entry.value);
    }
  }
}

//Returns a number between 0 and upper by hashing the string passed in
function _hashString(str, upper) {
  if(!upper || upper < 0) throw Error('Invalid upper bound provided. Must be an integer greater than 0, gave: ' + upper);
  let hash = 0, i, chr;
  for (i = 0; i < str.length; i++) {
    chr   = str.charCodeAt(i);
    hash  = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  let remainder = hash%upper;
  if(remainder < 0) remainder+=upper;
  return remainder
}

