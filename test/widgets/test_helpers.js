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