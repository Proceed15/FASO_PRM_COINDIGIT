class User {
  final String? id;
  final String name;
  final String email;
  final String password;
  final String? phone;
  final String? address;
  final String? photo;

  User({
    this.id,
    required this.name,
    required this.email,
    required this.password,
    this.phone,
    this.address,
    this.photo,
  });

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      id: json['id']?.toString(),
      name: json['name'] ?? '',
      email: json['email'] ?? '',
      password: json['password'] ?? '',
      phone: json['phone'],
      address: json['address'],
      photo: json['photo'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      if (id != null) "id": int.parse(id!),
      "name": name,
      "email": email,
      "password": password,
      "phone": phone ?? "",
      "address": address ?? "",
      "photo": photo ?? "",
    };
  }
}
