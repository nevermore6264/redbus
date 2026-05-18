package com.redbus.tienich;

import java.security.SecureRandom;

public final class TienIchMaVe {

    private static final String KY_TU = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    private static final SecureRandom RANDOM = new SecureRandom();

    private TienIchMaVe() {}

    public static String taoMaHienThi() {
        StringBuilder sb = new StringBuilder("RB");
        for (int i = 0; i < 8; i++) {
            sb.append(KY_TU.charAt(RANDOM.nextInt(KY_TU.length())));
        }
        return sb.toString();
    }
}
