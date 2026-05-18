package com.redbus.hotro;

import org.junit.jupiter.params.provider.Arguments;

import java.util.stream.IntStream;
import java.util.stream.Stream;

/**
 * Nguồn dữ liệu tham số: mỗi class test dùng tối thiểu 1000 case (chỉ số 1..1000).
 */
public final class NguonCase {

    public static final int SO_CASE_TOI_THIEU = 1000;

    private NguonCase() {
    }

    public static Stream<Integer> chiSo() {
        return IntStream.rangeClosed(1, SO_CASE_TOI_THIEU).boxed();
    }

    public static Stream<Arguments> chiSoVaChuoiMau() {
        return chiSo().map(i -> Arguments.of(i, "gia-tri-" + i));
    }

    public static String chuoiTheoChiSo(int chiSo) {
        return "mau-" + chiSo;
    }
}
