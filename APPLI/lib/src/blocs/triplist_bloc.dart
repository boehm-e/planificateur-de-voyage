import '../resources/repository.dart';
import 'package:rxdart/rxdart.dart';
import '../models/triplist_model.dart';

class TripListBloc {
  final _repository = Repository();
  final _tripListFetcher = PublishSubject<TripList>();

  Observable<TripList> get tripList => _tripListFetcher.stream;

  fetchTripList() async {
    TripList itemModel = await _repository.fetchAllTrips();
    _tripListFetcher.sink.add(itemModel);
  }

  createTrip(String name, String description, DateTime startDate, DateTime endDate) async {
    return await _repository.createTrip(name, description, startDate, endDate);
  }

  createEvent(int tripId, String type, String name, DateTime startDate, DateTime endDate, Location startLocation, Location endLocation) async {
    return await _repository.createEvent(tripId, type, name, startDate, endDate, startLocation, endLocation);
  }

  removeTrip(int id) async {
   return await _repository.removeTrip(id);
  }

  dispose() {
    _tripListFetcher.close();
  }
}

final trip_bloc = TripListBloc();