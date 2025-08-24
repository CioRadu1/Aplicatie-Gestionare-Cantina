package main.Aplicatie.Gestionare.Stocuri.model;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;

@Entity
@Table(name = "reteta_ingrediente")
@Data
public class RetetaIngrediente {
    @EmbeddedId
    private RetetaIngredienteKey id;

    private BigDecimal cantitate;
    private String um;
    private BigDecimal necesar;
    private String numeReteta;
    private String numeMateriePrima;
}