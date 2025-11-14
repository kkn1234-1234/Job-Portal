import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class Hash {

    public static void main(String[] args) {
        var encoder = new BCryptPasswordEncoder();
        System.out.println(encoder.encode("12345678"));
    }
}
