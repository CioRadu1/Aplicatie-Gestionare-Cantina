package main.Aplicatie.Gestionare.Stocuri.model;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.Data;
import java.io.Serializable;

@Embeddable
@Data
public class RetetaIngredienteKey implements Serializable {
    @Column(name = "cod_reteta")
    private String codReteta;
    @Column(name = "cod_ingredient")
    private String codIngredient;
}