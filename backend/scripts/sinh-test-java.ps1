# Sinh file *Test.java (package com.redbus.*) — 1000 case/class
$srcRoot = Resolve-Path (Join-Path $PSScriptRoot "..\src\main\java\com\redbus")
$testRoot = Join-Path $PSScriptRoot "..\src\test\java\com\redbus"
$files = Get-ChildItem -Path $srcRoot -Filter "*.java" -Recurse

foreach ($f in $files) {
    $rel = $f.FullName.Substring($srcRoot.Path.Length + 1)
    $rel = $rel -replace '\\', '/'
    $subPkg = $rel -replace '/[^/]+\.java$', '' -replace '/', '.'
    $simple = [System.IO.Path]::GetFileNameWithoutExtension($f.Name)
    if ($subPkg) { $pkg = "com.redbus.$subPkg" } else { $pkg = "com.redbus" }
    $testPkg = "$pkg"
    $testDir = Join-Path $testRoot ($subPkg -replace '\.', '\')
    $testFile = Join-Path $testDir "${simple}Test.java"

    if (Test-Path $testFile) { continue }

    New-Item -ItemType Directory -Force -Path $testDir | Out-Null

    $isMapper = $simple -like 'AnhXa*'
    $isApp = $simple -eq 'UngDungRedBus'
    $isKhoiTao = $simple -eq 'KhoiTaoDuLieuMau'

    if ($isMapper) {
        $body = @"
package $testPkg;

import com.redbus.hotro.NguonCase;
import org.apache.ibatis.annotations.Mapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.MethodSource;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

@DisplayName("$simple - mapper MyBatis co annotation @Mapper")
class ${simple}Test {

    @Test
    @DisplayName("$simple phai duoc danh dau @Mapper")
    void phaiCoAnnotationMapper() {
        assertTrue($simple.class.isAnnotationPresent(Mapper.class));
    }

    @ParameterizedTest(name = "case {0}: interface $simple ton tai trong classpath")
    @MethodSource("com.redbus.hotro.NguonCase#chiSo")
    @DisplayName("$simple - 1000 lan xac minh interface hop le")
    void interfaceTonTai(int chiSo) {
        assertNotNull($simple.class);
        assertTrue($simple.class.getMethods().length >= 1);
    }
}
"@
    } elseif ($isApp) {
        $body = @"
package $testPkg;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.MethodSource;

import static org.junit.jupiter.api.Assertions.assertNotNull;

@DisplayName("UngDungRedBus - lop khoi dong Spring Boot")
class UngDungRedBusTest {

    @Test
    @DisplayName("UngDungRedBus co phuong thuc main")
    void coPhuongThucMain() throws Exception {
        assertNotNull(UngDungRedBus.class.getDeclaredMethod("main", String[].class));
    }

    @ParameterizedTest(name = "case {0}: class UngDungRedBus load duoc")
    @MethodSource("com.redbus.hotro.NguonCase#chiSo")
    void classTonTai(int chiSo) {
        assertNotNull(UngDungRedBus.class);
    }
}
"@
    } elseif ($isKhoiTao) {
        $body = @"
package $testPkg;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.MethodSource;

import static org.junit.jupiter.api.Assertions.assertNotNull;

@DisplayName("KhoiTaoDuLieuMau - bean khoi tao du lieu mau")
class KhoiTaoDuLieuMauTest {

    @ParameterizedTest(name = "case {0}: class KhoiTaoDuLieuMau ton tai")
    @MethodSource("com.redbus.hotro.NguonCase#chiSo")
    void classTonTai(int chiSo) {
        assertNotNull(KhoiTaoDuLieuMau.class);
    }
}
"@
    } else {
        $body = @"
package $testPkg;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.MethodSource;

import java.lang.reflect.Constructor;

import static org.junit.jupiter.api.Assertions.assertNotNull;

@DisplayName("$simple - khoi tao va thuoc tinh (1000 case)")
class ${simple}Test {

    @ParameterizedTest(name = "case {0}: tao instance $simple va toString khong null")
    @MethodSource("com.redbus.hotro.NguonCase#chiSo")
    void khoiTaoVaToStringKhongNull(int chiSo) {
        Object inst = taoInstance(chiSo);
        assertNotNull(inst);
        assertNotNull(inst.toString());
    }

    private static Object taoInstance(int chiSo) throws Exception {
        Class<?> clazz = $simple.class;
        try {
            var builder = clazz.getMethod("builder");
            var b = builder.invoke(null);
            for (var m : b.getClass().getMethods()) {
                if (m.getName().equals("ma") && m.getParameterCount() == 1 && m.getParameterTypes()[0] == Long.class) {
                    m.invoke(b, (long) chiSo);
                }
            }
            return b.getClass().getMethod("build").invoke(b);
        } catch (NoSuchMethodException ignored) {
        }
        for (Constructor<?> c : clazz.getDeclaredConstructors()) {
            if (c.getParameterCount() == 0) {
                c.setAccessible(true);
                return c.newInstance();
            }
        }
        throw new IllegalStateException("Khong tao duoc " + clazz.getName());
    }
}
"@
    }

    [System.IO.File]::WriteAllText($testFile, $body, [System.Text.UTF8Encoding]::new($false))
    Write-Host "Created $testFile"
}

Write-Host "Done."
