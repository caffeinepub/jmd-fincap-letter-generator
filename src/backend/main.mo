import Text "mo:core/Text";
import Time "mo:core/Time";
import Iter "mo:core/Iter";
import Order "mo:core/Order";
import Map "mo:core/Map";
import Int "mo:core/Int";
import Runtime "mo:core/Runtime";
import Nat "mo:core/Nat";



actor {
  type LetterType = {
    #noc;
    #closerLetter;
    #paymentReceived;
    #paymentReceipt;
  };

  type LetterRecord = {
    id : Nat;
    customerName : Text;
    loanAccountNumber : Text;
    loanAmount : Text;
    date : Text;
    letterType : LetterType;
    createdAt : Time.Time;
  };

  module LetterRecord {
    public func compareByCreatedAtDesc(lhs : LetterRecord, rhs : LetterRecord) : Order.Order {
      Int.compare(rhs.createdAt, lhs.createdAt);
    };
  };

  var nextId = 1;
  let letters = Map.empty<Nat, LetterRecord>();

  public shared ({ caller }) func createLetter(customerName : Text, loanAccountNumber : Text, loanAmount : Text, date : Text, letterType : LetterType) : async Nat {
    let id = nextId;
    nextId += 1;

    let newLetter : LetterRecord = {
      id;
      customerName;
      loanAccountNumber;
      loanAmount;
      date;
      letterType;
      createdAt = Time.now();
    };

    letters.add(id, newLetter);
    id;
  };

  public query ({ caller }) func getLetter(id : Nat) : async LetterRecord {
    switch (letters.get(id)) {
      case (null) { Runtime.trap("Letter not found") };
      case (?letter) { letter };
    };
  };

  public query ({ caller }) func getAllLetters() : async [LetterRecord] {
    letters.values().toArray().sort(LetterRecord.compareByCreatedAtDesc);
  };

  public shared ({ caller }) func deleteLetter(id : Nat) : async () {
    switch (letters.get(id)) {
      case (null) { Runtime.trap("Letter not found") };
      case (_) {
        letters.remove(id);
      };
    };
  };
};
