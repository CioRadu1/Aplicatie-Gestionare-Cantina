package main.Aplicatie.Gestionare.Stocuri.model;

import jakarta.persistence.Embeddable;
import lombok.Data;
import java.io.Serializable;
import java.time.LocalDate;
import java.util.Date;

@Embeddable
@Data
public class IntrariMagazieKey implements Serializable {
    private String codIngredient;
    private LocalDate dataAchizitie;
}