package main.Aplicatie.Gestionare.Stocuri.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

@Controller
public class SPAController {
    @RequestMapping(value = "/{path:[^\\.]*}", method = RequestMethod.GET)
    public String forward() {
        return "forward:/index.html";
    }
    @RequestMapping(value = "/api/**", method = RequestMethod.GET)
    public void api() {
    }
}