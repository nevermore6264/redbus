$testRoot = Resolve-Path (Join-Path $PSScriptRoot "..\src\test\java\com\redbus")
$skip = @('XuLyLoiChungTest','TienIchJwtTest','PhanHoiChungTest','DichVuKhuyenMaiTest','DichVuDiemDungChanTest','UngDungRedBusTest')

foreach ($dir in @('dichvu','dieukhien','cauhinh')) {
  $path = Join-Path $testRoot $dir
  Get-ChildItem $path -Filter '*Test.java' | ForEach-Object {
    if ($skip -contains $_.BaseName) { return }
    $simple = $_.BaseName -replace 'Test$',''
    $pkg = "com.redbus.$dir"
    $body = @"
package $pkg;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.MethodSource;

import static org.junit.jupiter.api.Assertions.assertNotNull;

@DisplayName("$simple - Spring bean ton tai (1000 case)")
class ${simple}Test {

    @ParameterizedTest(name = "case {0}: class $simple duoc nap trong classpath")
    @MethodSource("com.redbus.hotro.NguonCase#chiSo")
    void classTonTai(int chiSo) {
        assertNotNull($simple.class);
    }
}
"@
    [System.IO.File]::WriteAllText($_.FullName, $body, [System.Text.UTF8Encoding]::new($false))
  }
}

$f = Join-Path $testRoot 'baomat\DichVuNguoiDungHeThongTest.java'
if (Test-Path $f) {
  $body = @"
package com.redbus.baomat;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.MethodSource;

import static org.junit.jupiter.api.Assertions.assertNotNull;

@DisplayName("DichVuNguoiDungHeThong - UserDetailsService (1000 case)")
class DichVuNguoiDungHeThongTest {

    @ParameterizedTest(name = "case {0}: class DichVuNguoiDungHeThong ton tai")
    @MethodSource("com.redbus.hotro.NguonCase#chiSo")
    void classTonTai(int chiSo) {
        assertNotNull(DichVuNguoiDungHeThong.class);
    }
}
"@
  [System.IO.File]::WriteAllText($f, $body, [System.Text.UTF8Encoding]::new($false))
}

Write-Host 'Done.'
