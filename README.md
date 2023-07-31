# Front-end Basestation 2023

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

### How To Check mtcasts is still runinng

```sh
sudo netstat -tulpn
```

### How To Write to UDP Network

```sh
nc -u <ip_address> <port>
```

### How To prevent unchanges git but detect changes

```sh
git add -uv
```

## Main Contributors

- Ahmad Ferdiansyah Ramadhani ([ramamimu](https://github.com/ramamimu))

- Midyanisa Yuniar ([Yuniarr](https://github.com/Yuniarrr))

## SOP

- hapus cache
- bawa mouse
- always on, jgn sleep
- cas baterai laptop
- bawa usb to lan
- matikan --host

rekam pertandingan

1. Buka status contorol robot [1, 1, 1, 0, 0]
2. Cek group multicast
   224.16.32.80
3. Cek ip robot
   192.168.20.57
   192.168.20.58
   192.168.20.59
   192.168.20.60
4. Samain ip di be dan fe
<!-- setup.json -->
5. is_multicast true
6. override_mode: false
7. Pastikan mode
   CYAN
8. is_2019: true
9. is_ros: true
10. is_roslib: false
11. is_multicast: true
12. is_nasional: true

<!-- refbox -->

13. ip_refbox & port_refbox
    192.168.20.4

<!-- ketika main -->

14. run be dulu
15. kemudian run fe

16. static ip
    - ip: 192.168.20.61
    - netmask: 255.255.255.0
    - gateway: 192.168.20.1
17. coba connect refbox
18. 1 bola mati
19. copot mouse
