
package br.itb.projeto.pizzaria.service;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    // RECUPERACAO DE SENHA

    public void enviarCodigo(String destino, String codigo) {

        SimpleMailMessage mensagem = new SimpleMailMessage();

        mensagem.setTo(destino);
        mensagem.setSubject(
            "Instituto Recomeçar - Recuperação de senha"
        );

        mensagem.setText(
            "Olá!\n\n"
            + "Seu código de recuperação de senha é: "
            + codigo
            + "\n\nSe você não solicitou esse código, "
            + "desconsidere esta mensagem."
            + "\n\nInstituto Recomeçar"
        );

        mailSender.send(mensagem);
    }

    // RESULTADO DA SOLICITACAO DE VENDEDORA

    public void enviarResultadoSolicitacao(
            String destino,
            boolean aprovada,
            String justificativa) {

        SimpleMailMessage mensagem = new SimpleMailMessage();

        mensagem.setTo(destino);

        if (aprovada) {

            mensagem.setSubject(
                "Instituto Recomeçar - Solicitação aprovada"
            );

            mensagem.setText(
                "Olá!\n\n"
                + "Parabéns! Sua solicitação para se tornar "
                + "vendedora do Instituto Recomeçar foi APROVADA.\n\n"
                + "Agora você pode acessar a área da vendedora "
                + "e cadastrar seus produtos no catálogo.\n\n"
                + "Instituto Recomeçar"
            );

        } else {

            mensagem.setSubject(
                "Instituto Recomeçar - Solicitação não aprovada"
            );

            mensagem.setText(
                "Olá!\n\n"
                + "Sua solicitação para se tornar vendedora "
                + "do Instituto Recomeçar não foi aprovada.\n\n"
                + (justificativa != null && !justificativa.isBlank()
                    ? "Motivo: " + justificativa + "\n\n"
                    : "")
                + "Você poderá revisar seus dados e "
                + "entrar em contato com a administração.\n\n"
                + "Instituto Recomeçar"
            );
        }

        mailSender.send(mensagem);
    }

    // RESULTADO DO CADASTRO DE PSICOLOGA

    public void enviarResultadoCadastroPsicologa(
            String destino,
            boolean aprovada,
            String motivo,
            String crp) {

        SimpleMailMessage mensagem = new SimpleMailMessage();

        mensagem.setTo(destino);

        if (aprovada) {

            mensagem.setSubject(
                "Cadastro de psicóloga APROVADO"
            );

            mensagem.setText(
                "Parabéns! Seu cadastro de psicóloga "
                + (crp != null ? "(CRP " + crp + ") " : "")
                + "foi APROVADO.\n"
                + "Você já pode acessar a área das psicólogas "
                + "e configurar seus horários de atendimento.\n"
                + "\nNão responda este e-mail."
            );

        } else {

            mensagem.setSubject(
                "Cadastro de psicóloga não aprovado"
            );

            mensagem.setText(
                "Seu cadastro de psicóloga "
                + (crp != null ? "(CRP " + crp + ") " : "")
                + "não foi aprovado pela administração.\n"
                + (motivo != null ? "Motivo: " + motivo + "\n" : "")
                + "Você pode revisar os dados e entrar em contato "
                + "com a administração do Instituto Recomeçar.\n"
                + "\nNão responda este e-mail."
            );
        }

        mailSender.send(mensagem);
    }
}
