package classes;

import com.google.gson.Gson;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.HashMap;
import java.util.Map;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

@WebServlet(name = "WordleServlet", urlPatterns = {"/WordleServlet"})
public class WordleServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        String guess = request.getParameter("guess");
        String answer = request.getParameter("answer");
        PrintWriter pw = response.getWriter();
        
        Map<Integer,String> map = new HashMap<>();
        
        for(int i = 0; i < guess.length(); i++) {
            char c = guess.charAt(i);
            if(answer.charAt(i) == c) {
                map.put(i, "green");
            }else if(answer.contains(Character.toString(c))) {
                map.put(i, "yellow");
            }else {
                map.put(i, "gray");
            }
        }
        
        Gson gson = new Gson();
        String json = gson.toJson(map);
        pw.print(json);
    }

}
