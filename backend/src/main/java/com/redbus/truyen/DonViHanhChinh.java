package com.redbus.truyen;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class DonViHanhChinh {

    private String name;
    private Integer code;
    private String division_type;
    private String codename;
    private Integer province_code;
}
