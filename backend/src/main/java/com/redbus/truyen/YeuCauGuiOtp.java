package com.redbus.truyen;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class YeuCauGuiOtp {

    @NotBlank
    @Email
    private String email;
}
