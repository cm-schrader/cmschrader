% Christian M. Schrader

function [x,h] = rkf45(func,x,params,env,h,t)
%rkf45 Runge–Kutta–Fehlberg Method (4th and 5th order)
%   https://www.johndcook.com/blog/2020/02/19/fehlberg/

h_min = 0.005;
h_max = 0.1;

k1 = h * func(x,params,env);
k2 = h * func(x+k1/4,params,env);
k3 = h * func(x+k1*3/32 + k2*9/32,params,env);
k4 = h * func(x + k1*1932/2197 - k2*7200/2197 + k3*7296/2197,params,env);
k5 = h * func(x + k1*439/216 - 8*k2 + k3*3680/513 - k4*845/4104,params,env);
k6 = h * func(x - k1*8/27 + k2*2 - k3*3544/2565 + k4*1859/4104 - k5*11/40,params,env);

x_4 = x + 25/216*k1 + 1408/2565*k3 + 2197/4104*k4 - 1/5*k5;
x_5 = x + 16/135*k1 + 6656/12825*k3 + 28561/56430*k4 - 9/50*k5 + 2/55*k6;

e = abs(x_5-x_4);

s = (eps*x./(2*((t+h)-t).*e)).^(1/4);

if any(isnan(s))
    error('Increase simulation step size')
end

if rms(s) >= 2
    x = x_5;
    h = 2*h;
elseif rms(s) >= 1
    x = x_5;
elseif rms(s) < 1
    x = x_5;
    h = 0.5*h;
end

if h <= h_min
    h = h_min;
elseif h >= h_max
    h = h_max;
end

end

