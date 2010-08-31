module("Helpers")

test("converting bytes to megabytes", function () {
  equal(Jam.Helper.bytesToMegabytes(1048576), "1MB")
  equal(Jam.Helper.bytesToMegabytes(1572864), "1.5MB")
  equal(Jam.Helper.bytesToMegabytes(1835008), "1.75MB")
})

test('millieseconds to hours minutes and seconds', function () {
  equals(Jam.Helper.millisecondsToHrsMinSec(37800000), "10:30:00")
  equals(Jam.Helper.millisecondsToHrsMinSec(5400000), "1:30:00")
  equals(Jam.Helper.millisecondsToHrsMinSec(1800000), "30:00")
  equals(Jam.Helper.millisecondsToHrsMinSec(180000), "3:00")
  equals(Jam.Helper.millisecondsToHrsMinSec(30000), "0:30")
})

test("displaying numbers as currency", function () {
  equals(Jam.Helper.numberToCurrency(2), "£2.00")
  equals(Jam.Helper.numberToCurrency(2.1), "£2.10")
  equals(Jam.Helper.numberToCurrency(2.11), "£2.11")
  equals(Jam.Helper.numberToCurrency(2.111), "£2.11")
  equals(Jam.Helper.numberToCurrency(2.111, { currency: "$"}), "$2.11")

  // should still work even if a string representation of a number is passed
  equals(Jam.Helper.numberToCurrency("2.111"), "£2.11")
})

test("truncating text to a specific length", function () {
  var testString = "The quick brown fox jumped over the lazy dog"
  equals(Jam.Helper.truncateText(testString, 9), "The quick…")
  equals(Jam.Helper.truncateText(testString, 12), "The quick brown…")
  equals(Jam.Helper.truncateText(testString, 50), testString)
  equals(Jam.Helper.truncateText(undefined, 100), "")
})