package main.Aplicatie.Gestionare.Stocuri.model;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.Data;
import org.springframework.format.annotation.DateTimeFormat;

import java.io.Serializable;
import java.time.LocalDate;
import java.util.Date;

@Embeddable
@Data
public class IntrariMagazieKey implements Serializable {
    @Column(name = "cod_ingredient")
    private String codIngredient;

    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private LocalDate dataAchizitie;
}