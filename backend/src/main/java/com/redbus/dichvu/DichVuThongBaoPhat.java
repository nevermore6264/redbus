package com.redbus.dichvu;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
@Slf4j
public class DichVuThongBaoPhat {

    private final Map<Long, SseEmitter> ketNoi = new ConcurrentHashMap<>();

    public SseEmitter dangKy(Long maTaiKhoan) {
        SseEmitter cu = ketNoi.remove(maTaiKhoan);
        if (cu != null) {
            cu.complete();
        }
        SseEmitter emitter = new SseEmitter(0L);
        ketNoi.put(maTaiKhoan, emitter);
        emitter.onCompletion(() -> ketNoi.remove(maTaiKhoan, emitter));
        emitter.onTimeout(() -> ketNoi.remove(maTaiKhoan, emitter));
        emitter.onError(e -> ketNoi.remove(maTaiKhoan, emitter));
        try {
            emitter.send(SseEmitter.event().name("ket-noi").data("ok"));
        } catch (IOException e) {
            log.debug("SSE ket noi loi: {}", e.getMessage());
        }
        return emitter;
    }

    public void phat(Long maTaiKhoan, String tieuDe, String noiDung) {
        SseEmitter emitter = ketNoi.get(maTaiKhoan);
        if (emitter == null) {
            return;
        }
        try {
            String payload = "{\"tieuDe\":\"" + escape(tieuDe) + "\",\"noiDung\":\"" + escape(noiDung) + "\"}";
            emitter.send(SseEmitter.event().name("thong-bao").data(payload));
        } catch (Exception e) {
            ketNoi.remove(maTaiKhoan);
            emitter.complete();
        }
    }

    private String escape(String s) {
        if (s == null) {
            return "";
        }
        return s.replace("\\", "\\\\").replace("\"", "\\\"").replace("\n", " ");
    }
}
