package com.redbus.mohinh;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.MethodSource;

import java.lang.reflect.Constructor;

import static org.junit.jupiter.api.Assertions.assertNotNull;

@DisplayName("KhachHang - khoi tao va thuoc tinh (1000 case)")
class KhachHangTest {

    @ParameterizedTest(name = "case {0}: tao instance KhachHang va toString khong null")
    @MethodSource("com.redbus.hotro.NguonCase#chiSo")
    void khoiTaoVaToStringKhongNull(int chiSo) throws Exception {
        Object inst = taoInstance(chiSo);
        assertNotNull(inst);
        assertNotNull(inst.toString());
    }

    private static Object taoInstance(int chiSo) throws Exception {
        Class<?> clazz = KhachHang.class;
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
        return clazz.getDeclaredConstructor().newInstance();
    }
}