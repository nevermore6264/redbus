package com.redbus.truyen;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class LoTrinhBanDoPhanHoi {

    private List<DiemBanDoPhanHoi> diem;
}
