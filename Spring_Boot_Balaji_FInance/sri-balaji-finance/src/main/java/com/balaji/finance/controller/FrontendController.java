package com.balaji.finance.controller;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class FrontendController {

    @RequestMapping(value = "/balaji-finance")
    public String redirect() {
        return "redirect:/login";
    }
}
