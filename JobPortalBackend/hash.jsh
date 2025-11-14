import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

var encoder = new BCryptPasswordEncoder();
System.out.println(encoder.encode("12345678"));
